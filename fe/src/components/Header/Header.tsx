import { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";

const cx = classNames.bind(styles);

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
  
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
  
    return () => window.removeEventListener("storage", handleStorageChange);
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
        <Link to="/"> Home </Link>
        <Link to="/ticket"> Ticket </Link>
      </div>

      <div className={cx("right")}>
        <div>Nhà tài trợ</div>
      </div>

      <div className="sign-in">
        {isLoggedIn ? (
          <Button type="primary" onClick={handleLogout}>
            Đăng xuất
          </Button>
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
