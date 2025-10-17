import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { message } from "antd";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      message.warning("Vui lòng đăng nhập để tiếp tục!");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
