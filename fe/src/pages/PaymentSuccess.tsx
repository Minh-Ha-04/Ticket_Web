import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import instance from "../utils/axiosInstance";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (!orderId) return setStatus("fail");
  
    instance.get(`/pays/status?orderId=${orderId}`)
      .then(res => {
        if (res.data.status === "completed") setStatus("success");
        else setStatus("fail");
      })
      .catch(err => setStatus("fail"));
  }, [searchParams]);
  

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      {status === "loading" && <p>Đang kiểm tra trạng thái thanh toán...</p>}

      {status === "success" && (
        <>
          <h2> Thanh toán thành công!</h2>
          <p>Mã đơn hàng: {searchParams.get("orderId")}</p>
          <button onClick={() => navigate("/")}>Về trang chủ</button>
        </>
      )}

      {status === "fail" && (
        <>
          <h2> Thanh toán thất bại</h2>
          <p>Lý do: {searchParams.get("message") || "Không xác định"}</p>
          <button onClick={() => navigate("/ticket")}>Thử lại</button>
        </>
      )}
    </div>
  );
}

export default PaymentSuccess;
