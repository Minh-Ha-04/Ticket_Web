import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import instance from "../utils/axiosInstance";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      setStatus("fail");
      return;
    }

    // ✅ MoMo trả resultCode trực tiếp trên URL redirect
    const resultCode = searchParams.get("resultCode");
    if (resultCode !== null) {
      // resultCode=0 là thành công
      if (resultCode === "0") {
        setStatus("success");
      } else {
        setStatus("fail");
      }
      return;
    }

    // Fallback: không có resultCode → polling API (trường hợp truy cập URL thủ công)
    const MAX_RETRIES = 10;
    const INTERVAL_MS = 2000;
    let tries = 0;

    const checkStatus = async () => {
      try {
        const res = await instance.get(`/pays/status?orderId=${orderId}`);
        const payStatus = res.data.status;

        if (payStatus === "completed") {
          setStatus("success");
          return;
        }
        if (payStatus === "FAILED") {
          setStatus("fail");
          return;
        }

        tries++;
        setAttempt(tries);
        if (tries < MAX_RETRIES) {
          setTimeout(checkStatus, INTERVAL_MS);
        } else {
          setStatus("fail");
        }
      } catch {
        setStatus("fail");
      }
    };

    checkStatus();
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      {status === "loading" && (
        <>
          <p>⏳ Đang xác nhận thanh toán từ MoMo...</p>
          {attempt > 0 && (
            <p style={{ color: "#888", fontSize: "14px" }}>Đang kiểm tra lần {attempt}/10</p>
          )}
        </>
      )}

      {status === "success" && (
        <>
          <h2>✅ Thanh toán thành công!</h2>
          <p>Mã đơn hàng: <strong>{searchParams.get("orderId")}</strong></p>
          <p>Vé đã được gửi về email của bạn.</p>
          <button onClick={() => navigate("/")}>Về trang chủ</button>
        </>
      )}

      {status === "fail" && (
        <>
          <h2>❌ Thanh toán thất bại</h2>
          <p>Lý do: {searchParams.get("message") || "Không xác định"}</p>
          <button onClick={() => navigate("/ticket")}>Thử lại</button>
        </>
      )}
    </div>
  );
}

export default PaymentSuccess;
