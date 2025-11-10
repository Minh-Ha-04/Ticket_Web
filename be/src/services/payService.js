import crypto from "crypto";
import https from "https";
import querystring from "qs";


// ================= MoMo ==================
export const createMomoPayment = async (amount, orderInfo) => {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = partnerCode + Date.now();
    const orderId = requestId;
    const redirectUrl = "http://localhost:3000/payment-success";
    const ipnUrl = "http://localhost:5000/api/pays/momo-ipn";
    const requestType = "captureWallet";
    const extraData = "";
  
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
  
    const requestBody = JSON.stringify({
      partnerCode, accessKey, requestId, amount: String(amount),
      orderId, orderInfo, redirectUrl, ipnUrl, extraData,
      requestType, signature, lang: "vi"
    });
  
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };
  
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          const response = JSON.parse(body);
          console.log("🔹 MoMo response:", response);
          if (response.resultCode === 0 && response.payUrl) {
            resolve(response.payUrl);
          } else {
            reject(new Error(response.message || "Không thể tạo phiên thanh toán MoMo"));
          }
        });
      });
      req.on("error", reject);
      req.write(requestBody);
      req.end();
    });
  };

// ================= VNPay ==================
export const createVNPayPayment = async (amount, orderInfo, ipAddr) => {
  const tmnCode = "2QXUI4J4";
  const secretKey = "SECRETKEY123456789";
  const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = "https://your-site.com/vnpay_return";
  const createDate = new Date().toISOString().replace(/[-T:.Z]/g, "").substring(0, 14);
  const orderId = Math.floor(Math.random() * 1000000);
  const currCode = "VND";

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100, // nhân 100 vì VNPay tính theo đơn vị nhỏ nhất
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: createDate,
  };

  // === Sắp xếp key alphabet và tạo query string ===
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: vnp_Params[key] }), {});

  const signData = querystring.stringify(sortedParams, { encode: false });
  const secureHash = crypto.createHmac("sha512", secretKey).update(signData).digest("hex");

  const paymentUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${secureHash}`;
  return paymentUrl;
};

