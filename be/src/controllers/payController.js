import * as paymentService from "../services/payService.js";
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
      console.log("✅ Chữ ký hợp lệ, cập nhật trạng thái đơn hàng.");
      // TODO: cập nhật DB: đơn hàng orderId = "đã thanh toán"
      res.status(200).json({ message: "Confirm success" });
    } else {
      console.log("❌ Chữ ký không hợp lệ!");
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
          { status: "PAID", updatedAt: new Date() },
          { where: { id: payment.bookingId } }
        );
  
        // Cập nhật Ticket
        await Ticket.update(
          { status: "SOLD", updatedAt: new Date() },
          { where: { bookingId: payment.bookingId } }
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

export const confirmPayment = async(req,res)=>{
  try {
    const { orderId } = req.query;
    if (!orderId) return res.status(400).json({ message: "Thiếu orderId" });

    const payment = await Payment.findOne({ where: { orderId } });
    if (!payment) return res.status(404).json({ message: "Không tìm thấy payment" });

    // 2️⃣ Cập nhật trạng thái payment
    await payment.update({ status: "completed" });

    // 3️⃣ Cập nhật trạng thái booking
    const booking = await Booking.findByPk(payment.bookingId);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });
    await booking.update({ status: "confirmed" });

    await Ticket.update(
      { status: "sold" },
      { where: { bookingId: booking.id } }
    );
    res.status(200).json({
      message: "Thanh toán thành công, đã cập nhật payment, booking và ticket",
      bookingId: booking.id,
    });
  } catch (err) {
    console.error("Lỗi khi xác nhận payment:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}