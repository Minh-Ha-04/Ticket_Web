// src/App.tsx
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "./routes";

// 🟦 Thêm các import cho loading
import { useEffect, useContext } from "react";
import { LoadingProvider,LoadingContext } from "./contexts/LoadingContext";
import LoadingOverlay from "./components/LoadingOverlay";
import { registerSetLoading } from "./utils/axiosInstance";

function AppRoutes() {
  return useRoutes(routes);
}

// Component bọc để dùng context trong App chính
function AppWrapper() {
  const { loading, setLoading } = useContext(LoadingContext);

  // Đăng ký setLoading vào axios interceptor
  useEffect(() => {
    registerSetLoading(setLoading);
  }, []);

  return (
    <>
      <LoadingOverlay visible={loading} />
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
