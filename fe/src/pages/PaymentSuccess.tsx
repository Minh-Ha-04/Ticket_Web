import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import instance from "../utils/axiosInstance";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    const orderId = searchParams.get("orderId");

    if (resultCode === "0") {
      setStatus("success");
      instance
        .get(`/pays/confirm?orderId=${orderId}`)
        .then(() => console.log("✅ Đã xác nhận thanh toán thành công"))
        .catch((err) => console.error("❌ Lỗi xác nhận:", err));
    } else {
      setStatus("fail");
    }
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      {status === "loading" && <p>Đang kiểm tra trạng thái thanh toán...</p>}

      {status === "success" && (
        <>
          <h2>🎉 Thanh toán thành công!</h2>
          <p>Mã đơn hàng: {searchParams.get("orderId")}</p>
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
