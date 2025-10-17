import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function LoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      console.error("Token not found in URL");
      navigate("/login-failed");
      return;
    }

    try {
      const user = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error(err);
      navigate("/login-failed");
      return;
    }

    // Xóa query param và về Home
    navigate("/", { replace: true });
  }, [navigate, location]);

  return <p>Đang xử lý đăng nhập...</p>;
}

export default LoginSuccess;
