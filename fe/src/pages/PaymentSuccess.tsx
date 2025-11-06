import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    const orderId = searchParams.get("orderId");

    // if (resultCode === "0") {
    //   setStatus("success");
    //   // Gọi backend cập nhật đơn hàng
    //   fetch(`http://localhost:5000/api/payments/confirm?orderId=${orderId}`)
    //     .then(() => console.log("Đã cập nhật trạng thái thanh toán"));
    // } else {
    //   setStatus("fail");
    // }
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      {status === "success" ? (
        <>
          <h2>🎉 Thanh toán thành công!</h2>
          <p>Mã đơn hàng: {searchParams.get("orderId")}</p>
          <button onClick={() => navigate("/")}>Về trang chủ</button>
        </>
      ) : status === "fail" ? (
        <>
          <h2>❌ Thanh toán thất bại</h2>
          <p>Lý do: {searchParams.get("message")}</p>
          <button onClick={() => navigate("/cart")}>Thử lại</button>
        </>
      ) : (
        <p>Đang kiểm tra trạng thái thanh toán...</p>
      )}
    </div>
  );
}

export default PaymentSuccess;
