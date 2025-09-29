// src/layouts/DefaultLayout.tsx
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const { Content } = Layout;

const DefaultLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header />
        <Content style={{ margin: "16px" }}>
          <Outlet /> {/* Hiển thị page con */}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
