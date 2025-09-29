// src/App.tsx
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import routes from "./routes";

function AppRoutes(){
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
