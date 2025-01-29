import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import WorkshopProvider from "./context/contextapi.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WorkshopProvider>
      <App />
    </WorkshopProvider>
  </StrictMode>
);
