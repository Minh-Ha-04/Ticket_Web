import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../utils/axiosInstance";
import { message } from "antd";

function LoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const mode = params.get("mode");

    if (!token) {
      message.error("Token không hợp lệ!");
      navigate("/login-failed");
      return;
    }

    const verifyEmail = async () => {
      try {
        await instance.get(`/auth/verify-email?token=${token}`);
        message.success("Email đã được xác thực!");
        navigate("/login");
      } catch (err: any) {
        message.error(err.response?.data?.message || "Liên kết không hợp lệ!");
        navigate("/login-failed");
      }
    };

    const loginWithGoogle = async () => {
      try {
        // Lưu token
        localStorage.setItem("token", token);

        // Gọi backend để lấy thông tin user
        const res = await instance.get("/auth/me");
        const user = res.data.user;

        localStorage.setItem("user", JSON.stringify(user));

        message.success("Đăng nhập thành công!");

        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        message.error("Không lấy được thông tin người dùng!");
        navigate("/login-failed");
      }
    };

    if (mode === "verify") {
      verifyEmail();
    } else {
      loginWithGoogle();
    }
  }, [navigate, location]);

  return <p>Đang xử lý...</p>;
}

export default LoginSuccess;
