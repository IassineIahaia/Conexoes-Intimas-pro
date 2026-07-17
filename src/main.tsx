import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext.tsx";
import "./index.css";
import CookieConsent from "./components/CookieConsent.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <CookieConsent />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);