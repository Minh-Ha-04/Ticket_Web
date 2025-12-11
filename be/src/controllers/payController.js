import * as paymentService from "../services/payService.js";
import {sendEmail} from "../utils/sendEmail.js";
import {ticketTemplate} from "../utils/ticketTemplate.js";
import models from "../models/index.js";


const {Ticket, Booking,Payment,Discount} = models;



export const createPayment = async (req, res) => {
  try {
    console.log('Payment body:', req.body);
    const { method, amount, bookingId,discountCode } = req.body;
    const userId = req.user.id;
    const orderId = "MOMO_" + Date.now();
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "127.0.0.1";
      await Payment.create({
        orderId,
        bookingId,
        userId,
        paymentMethod : method,
        amount,
        status: "PENDING",
      });

      if (discountCode) {
        const discount = await Discount.findOne({ code: discountCode });
        if (discount) {
          discount.usedCount += 1;
          await discount.save();
        }
      }
    let payUrl;

    switch (method) {
      case "momo":
        payUrl = await  paymentService.createMomoPayment(amount, `Thanh toán đơn #${bookingId}`, orderId);
        break;

      case "vnpay":
        payUrl = await paymentService.createVNPayPayment(amount, `Thanh toán đơn #${bookingId}`, ipAddr);
        break;

      default:
        return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ" });
    }

    // Nếu thành công
    if (payUrl) {
      return res.status(200).json({ payUrl,orderId });
    } else {
      return res.status(500).json({ message: "Không thể tạo phiên bản thanh toán" });
    }
  } catch (err) {
    console.error("Lỗi khi tạo thanh toán:", err);
    res.status(500).json({ message: err.message });
  }
};
export const momoIpn = async (req, res) => {
    const data = req.body;
    console.log("🔔 IPN từ MoMo:", data);
  
    // Xác minh chữ ký
    const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = data;
  
    const rawSignature = `accessKey=F8BBA842ECF85&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const checkSignature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
  
    if (checkSignature === signature) {
      console.log("Chữ ký hợp lệ, cập nhật trạng thái đơn hàng.");
      // TODO: cập nhật DB: đơn hàng orderId = "đã thanh toán"
      res.status(200).json({ message: "Confirm success" });
    } else {
      console.log(" Chữ ký không hợp lệ!");
      res.status(400).json({ message: "Invalid signature" });
    }

    try {
      const payment = await Payment.findOne({ where: { orderId } });
      if (!payment) return res.status(404).json({ message: "Không tìm thấy giao dịch" });
  
      if (Number(resultCode) === 0) {
        // Cập nhật payment
        await payment.update({ status: "PAID" });
  
        // Cập nhật Booking
        await Booking.update(
          { status: "paid", updatedAt: new Date() },
          { where: { id: payment.bookingId } }
        );
  
        return res.status(200).json({ message: "Confirm success" });
      } else {
        await payment.update({ status: "FAILED" });
        return res.status(400).json({ message: `Thanh toán thất bại: ${data.message}` });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  };

  export const confirmPayment = async (req, res) => {
    try {
      const { orderId } = req.query;
      if (!orderId) return res.status(400).json({ message: "Thiếu orderId" });
  
      const payment = await Payment.findOne({ where: { orderId } });
      if (!payment)
        return res.status(404).json({ message: "Không tìm thấy payment" });
  
      // Cập nhật trạng thái payment
      await payment.update({ status: "completed" });
  
      //  Cập nhật booking
      const booking = await Booking.findByPk(payment.bookingId);
      if (!booking)
        return res.status(404).json({ message: "Không tìm thấy booking" });
  
      await booking.update({ status: "confirmed" });
  
      // Cập nhật ticket
      await Ticket.update(
        { status: "sold" },
        { where: { bookingId: booking.id } }
      );
  
      // Lấy danh sách ticket
      const tickets = await Ticket.findAll({
        where: { bookingId: booking.id },
      });
  
      // Lấy thông tin user để gửi email
      const user = await models.User.findByPk(payment.userId);
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy user" });
  
      // Tạo nội dung HTML email
      const htmlContent = ticketTemplate(booking, tickets);
  
      // Gửi email vé
      await sendEmail(user.email, "🎫 Xác nhận đặt vé thành công", htmlContent);
  
      res.status(200).json({
        message:
          "Thanh toán thành công, đã cập nhật payment, booking, ticket và gửi email vé",
        bookingId: booking.id,
      });
    } catch (err) {
      console.error("Lỗi khi xác nhận payment:", err);
      res.status(500).json({ message: "Lỗi server" });
    }
  };