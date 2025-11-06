import * as paymentService from "../services/payService.js";


export const createPayment = async (req, res) => {
  try {
    console.log('Payment body:', req.body);
    const { method, amount, orderInfo } = req.body;
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    let payUrl;

    switch (method) {
      case "momo":
        payUrl = await  paymentService.createMomoPayment(amount, orderInfo);
        break;

      case "vnpay":
        payUrl = await paymentService.createVNPayPayment(amount, orderInfo, ipAddr);
        break;

      default:
        return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ" });
    }

    // Nếu thành công
    if (payUrl) {
      return res.status(200).json({ payUrl });
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
  };