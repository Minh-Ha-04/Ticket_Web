import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import instance from "../utils/axiosInstance";
import { message } from "antd";

function LoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const mode = params.get("mode"); // thêm mode để phân biệt login hay verify

    if (!token) {
      message.error("Token không hợp lệ!");
      navigate("/login-failed");
      return;
    }

    const handleVerifyEmail = async () => {
      try {
        const res = await instance.get(`/auth/verify-email?token=${token}`);
        message.success("Email đã được xác thực, bạn có thể đăng nhập!");
        navigate("/login");
      } catch (err: any) {
        message.error(err.response?.data?.message || "Liên kết không hợp lệ!");
        navigate("/login-failed");
      }
    };

    if (mode === "verify") {
      handleVerifyEmail();
    } else {
      try {
        const user = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        message.success("Đăng nhập thành công!");
        navigate("/", { replace: true });
      } catch (err) {
        message.error("Token không hợp lệ!");
        navigate("/login-failed");
      }
    }
  }, [navigate, location]);

  return <p>Đang xử lý...</p>;
}

export default LoginSuccess;
