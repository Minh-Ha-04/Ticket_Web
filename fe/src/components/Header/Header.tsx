import { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { Button , Space} from "antd";
import instance from "../../utils/axiosInstance";
const cx = classNames.bind(styles);

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
  
      try {
        await instance.get("/auth/me");
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    };
  
    checkLogin();
  }, []);
  
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login"); 
  };

  return (
    <header className={cx("wrapper")}>
      <div className={cx("left")}>
        <img src="/logo192.png" alt="Logo" />
      </div>

      <div className={cx("center")}>
        <Link className={cx("children")} to="/"> Trang chủ </Link>
        <Link className={cx("children")} to="/ticket"> Mua vé </Link>
        <Link className={cx("children")} to="/calendar"> Lịch thi đấu </Link>
      </div>

      <div className={cx("right")}>
        <div>Nhà tài trợ</div>
      </div>

      <div className="sign-in">
        {isLoggedIn ? (
          <Space>
            <Button type = "default" onClick={() => navigate("/profile")} > 
            Thông Tin 
          </Button>
          
          <Button type="primary" onClick={handleLogout}>
            Đăng xuất
          </Button>
          </Space>
        ) : (
          <Link to="/login">
            <Button type="primary">Đăng nhập</Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
