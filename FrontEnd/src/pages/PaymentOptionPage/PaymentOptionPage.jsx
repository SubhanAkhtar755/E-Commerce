import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useDarkMode } from "../../context/DarkModeContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentOptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { darkMode } = useDarkMode();

  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const { product, subTotal, deliveryCharges, totalAmount } =
    location.state || {};

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border border-gray-700",
        inputBg:
          "bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] border border-gray-600 focus:ring-[#F59E0B]",
        btnPrimary: "bg-[#F59E0B] hover:bg-[#F59E0B] text-white",
        btnSelected: "bg-[#3B82F6] text-white border-[#3B82F6]",
        btnUnselected: "bg-[#1F2937] border-gray-600 hover:bg-[#374151]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border border-gray-200",
        inputBg:
          "bg-white text-[#111827] placeholder-[#4B5563] border border-gray-300 focus:ring-[#3B82F6]",
        btnPrimary: "bg-[#F59E0B] hover:bg-[#F59E0B] text-white",
         btnSelected: "bg-[#3B82F6] text-white border-[#3B82F6]",
        btnUnselected: "bg-white hover:bg-gray-100 border-gray-300",
      };

  if (!product) {
    return (
      <div className={`p-6 max-w-md mx-auto text-center text-red-500 ${theme.bg} ${theme.text}`}>
        No product found for payment
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!method) return toast.error("Please select a payment method!");
    setLoading(true);
    try {
      if (method === "COD") {
        const orderData = {
          products: [
            {
              product: product.productId,
              name: product.name,
              brand: product.brand,
              price: product.price,
              quantity: product.quantity,
              image: product.image,
            },
          ],
          shippingAddress: user.address || {},
          paymentMethod: "COD",
          paymentStatus: "Pending",
          totalAmount,
        };

        const res = await axios.post(
          "http://localhost:4001/api/orders",
          orderData,
          { withCredentials: true }
        );

        if (res.status === 201) {
          toast.success("Order placed successfully!");
          navigate("/"); // redirect home
        }
      } else {
        toast.info(`${method} payment flow coming soon`);
      }
    } catch (err) {
      toast.error("Order failed! " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 lg:pl-44 lg:pr-44 min-h-screen ${theme.bg} ${theme.text}`}>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Choose Payment Method
      </h2>

      {/* 🏠 Shipping Address */}
      <div className={`p-4 rounded-lg mb-6 shadow-sm ${theme.card}`}>
        <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
        {user?.address ? (
          <>
            <p>
              {user.address.street}, {user.address.city}, {user.address.state} -{" "}
              {user.address.postalCode}
            </p>
            <p>
              {user.address.country} | {user.address.phone}
            </p>
          </>
        ) : (
          <p className="text-red-500">No address found. Please add one.</p>
        )}
      </div>

      {/* 💳 Payment Options */}
      <div className="grid gap-4 mb-6">
        {["COD", "PayOnline"].map((option) => (
          <button
            key={option}
            onClick={() => setMethod(option)}
            className={`w-full p-4 rounded-lg border text-left shadow-sm transition 
              ${
                method === option
                  ? theme.btnSelected
                  : theme.btnUnselected
              }`}
          >
            <span className="font-medium text-lg">
              {option === "COD" ? "💵 Cash on Delivery" : "💳 PayOnline"}
            </span>
          </button>
        ))}
      </div>

      {/* ✅ Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-lg transition ${theme.btnPrimary}`}
      >
        {loading ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
};

export default PaymentOptionPage;
