import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { DarkModeProvider } from "./context/DarkModeContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { CartProvider } from "./context/CartContext.jsx"; // ✅ import
import { DashboardProvider } from "./context/DashboardContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    
    <BrowserRouter>
      <DarkModeProvider>
        <DashboardProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider> {/* ✅ Wrap with CartProvider */}
              <App />
              {/* ✅ ToastContainer ek dafa yahan */}
              <ToastContainer position="top-right" autoClose={2000} />
            </CartProvider>
          </ProductProvider>
        </UserProvider>
        </DashboardProvider>
      </DarkModeProvider>
    </BrowserRouter>
  </StrictMode>
);
