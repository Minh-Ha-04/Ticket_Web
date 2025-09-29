// src/components/FooterBar.tsx
import { Layout } from "antd";
const { Footer } = Layout;

const FooterBar = () => (
  <Footer style={{ textAlign: "center" }}>
    © {new Date().getFullYear()} Premier League News
  </Footer>
);

export default FooterBar;
