import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const { Content } = Layout;

const LayoutAdmin = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}> 
        <Layout>
            <Navbar />
            <Content style={{ margin: "16px" }}>
                <Outlet />
            </Content>
        </Layout>
    </Layout>
  );
};

export default LayoutAdmin;