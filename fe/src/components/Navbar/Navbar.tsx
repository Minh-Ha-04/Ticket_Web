import { Menu } from "antd";
import {
  PictureOutlined,
  TrophyOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "poster",
      icon: <PictureOutlined />,
      label: "Quản lý giao diện",
      onClick: () => navigate("/admin"),
    },
    {
      key: "team",
      icon: <TrophyOutlined />,
      label: "Quản lý đội bóng",
      onClick: () => navigate("/admin/teams"),
    },
    {
      key: "matches",
      icon: <CalendarOutlined />,
      label: "Quản lý trận đấu",
      onClick: () => navigate("/admin/matches"),
    },
    {
      key: "tickets",
      icon: <CreditCardOutlined />,
      label: "Quản lý vé",
      onClick: () => navigate("/admin/tickets"),
    },
    {
      key: "stadiums",
      icon: <EnvironmentOutlined />,
      label: "Quản lý sân vận động",
      onClick: () => navigate("/admin/stadiums"),
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Quản lý người dùng",
      onClick: () => navigate("/admin/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-white shadow-md">
      <Menu
        mode="horizontal"
        items={menuItems}
        className="flex justify-center"
        style={{ borderBottom: "none", padding: "0 20px" }}
      />
    </div>
  );
};

export default Navbar;
