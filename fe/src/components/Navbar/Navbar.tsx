
import { Menu } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
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
      key : "poster",
      icon: <TeamOutlined />,
      label : "Quản lý giao diện",
      onClick : () => navigate("/admin")
    },
    {
      key: "team",
      icon: <TeamOutlined />,
      label: "Quản lý đội bóng",
      onClick: () => navigate("/admin/teams"),
    },
    {
      key: "matches",
      icon: <UserOutlined />,
      label: "Quản lý trận đấu",
      onClick: () => navigate("/admin/matches"),
    },
    {
      key: "tickets",
      icon: <CalendarOutlined />,
      label: "Quản lý vé",
      onClick: () => navigate("/admin/tickets"),
    },
    {
      key: "stadiums",
      icon: <CalendarOutlined />,
      label: "Quản lý sân vận động",
      onClick: () => navigate("/admin/stadiums"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout, // 
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
