import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/global.scss";
import { App as AntdApp } from "antd";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AntdApp>
      <App />
    </AntdApp>
  </React.StrictMode>
);
