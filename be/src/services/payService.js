import crypto from "crypto";
import https from "https";
import querystring from "qs";
import dotenv from "dotenv";
dotenv.config();
// ================= MoMo ==================
export const createMomoPayment = async (amount, orderInfo,orderId) => {
    const partnerCode = "MOMO";
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;    
    const requestId = orderId
    const redirectUrl = `${process.env.CLIENT_URL}/payment-success?orderId=${orderId}`;
    const ipnUrl = `${process.env.BACKEND_URL}/api/pays/momo-ipn`;
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

