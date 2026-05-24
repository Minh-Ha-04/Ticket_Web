import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { Button, message } from "antd";
import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../utils/axiosInstance";

const cx = classNames.bind(styles);

interface FormData {
  username: string;
  email?: string;
  password: string;
  confirmPassword?: string;
}

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const toggleForm = () => setIsRegister(!isRegister);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      message.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      if (isRegister) {
        if (!formData.email) {
          message.error("Vui lòng nhập email!");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          message.error("Mật khẩu xác nhận không khớp!");
          return;
        }
      
        await instance.post("/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      
        message.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
        setIsRegister(false);
      } else {
        const res = await instance.post("/auth/login", {
          username: formData.username,
          password: formData.password,
        });
      
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      
        message.success("Đăng nhập thành công!");
      
        const role = res.data.user.role;
        if (role === "admin") {
          navigate("/admin");
        } else {
          // Quay về trang đang xem trước khi bị bắt đăng nhập
          const redirectTo = localStorage.getItem("redirectAfterLogin");
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectTo || "/");
        }
      }      
    } catch (err: any) {
      message.error("Sai tài khoản hoặc mật khẩu!");
    }
  };

  // sự kiện đăng nhập google
  const handleGoogleLogin = () => {
    window.location.href = `${ process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className={cx("wrapper")}>
      <header className={cx("header")}>
        <Link to="/">
          <img src="/logo192.png" alt="Logo" className={cx("logo")} />
        </Link>
        <h1 className={cx("title")}>Welcome</h1>
        <p className={cx("subtitle")}>
          {isRegister
            ? "Đăng ký tài khoản mới"
            : "Đăng nhập "}
        </p>
      </header>

      <div className={cx("content")}>
          <form className={cx("form")} onSubmit={handleSubmit}>
            <div className={cx("form-group")}>
              <label>Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            {isRegister && (
              <div className={cx("form-group")}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>
            )}

            <div className={cx("form-group")}>
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            {isRegister && (
              <div className={cx("form-group")}>
                <label>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            )}

            <Button type="primary" htmlType="submit" block size="large">
              {isRegister ? "Đăng ký" : "Đăng nhập"}
            </Button>

            <div className={cx("toggle-link")}>
              {isRegister ? (
                <span onClick={toggleForm}>
                  Đã có tài khoản? Đăng nhập
                </span>
              ) : (
                <span onClick={toggleForm}>
                  Chưa có tài khoản? Đăng ký ngay
                </span>
              )}
            </div>
          </form>

        <div className={cx("login-google")}>
          <Button type="default" onClick={handleGoogleLogin} block size="large">
            <img
              src="/logo-gg.png"
              alt="Google Logo"
              className={cx("google-logo")}
            />
            Đăng nhập bằng Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
