import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Watermark from "./components/Watermark.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* Watermark يظهر فوق كل التطبيق */}
    <Watermark />

    {/* التطبيق الأصلي */}
    <App />
  </React.StrictMode>
);