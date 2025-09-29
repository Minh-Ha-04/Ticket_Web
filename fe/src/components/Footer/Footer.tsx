// src/components/FooterBar.tsx
import { Layout } from "antd";
const { Footer } = Layout;

const FooterBar = () => (
  <Footer style={{ textAlign: "center" }}>
  Real Madrid © {new Date().getFullYear()}. All rights reserved.
  </Footer>
);

export default FooterBar;
