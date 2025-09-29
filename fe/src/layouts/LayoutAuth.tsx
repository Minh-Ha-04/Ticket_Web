import { Outlet } from "react-router-dom";
import { Layout } from "antd";

const { Content } = Layout;

const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 400,
            padding: 24,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
