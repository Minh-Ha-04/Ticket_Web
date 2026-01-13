import * as paymentService from "../services/payService.js";
import {sendEmail} from "../utils/sendEmail.js";
import {ticketTemplate} from "../utils/ticketTemplate.js";
import models from "../models/index.js";
import crypto from "crypto";

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

  const { partnerCode, orderId, requestId, amount, orderInfo, orderType,
          transId, resultCode, message, payType, responseTime, extraData, signature } = data;

  // Xác minh chữ ký
  const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const checkSignature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

  if (checkSignature !== signature) {
    console.log("Chữ ký không hợp lệ!");
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const payment = await Payment.findOne({ where: { orderId } });
    if (!payment) return res.status(404).json({ message: "Không tìm thấy giao dịch" });

    if (Number(resultCode) === 0) {
      await payment.update({ status: "completed" });
      const booking = await Booking.findByPk(payment.bookingId);
      if (booking) await booking.update({ status: "paid" });
      
      await Ticket.update(
        { status: "sold", holdExpiresAt: null },
        { where: { bookingId: booking.id } }
      )
      // Gửi email
      const user = await models.User.findByPk(payment.userId);
      if (user) {
        const tickets = await Ticket.findAll({ where: { bookingId: booking.id } });
        const htmlContent = ticketTemplate(booking, tickets);
        await sendEmail(user.email, " Xác nhận đặt vé thành công", htmlContent);
      }

      return res.status(200).json({ message: "Confirm success" });
    } else {
      await payment.update({ status: "FAILED" });
      return res.status(400).json({ message: `Thanh toán thất bại: ${message}` });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const status = async (req, res) => {
  const { orderId } = req.query;
  const payment = await Payment.findOne({ where: { orderId } });
  if (!payment) return res.status(404).json({ message: "Không tìm thấy payment" });
  res.json({ status: payment.status });
};