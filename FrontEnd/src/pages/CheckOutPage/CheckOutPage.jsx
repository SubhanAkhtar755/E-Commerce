import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useDarkMode } from "../../context/DarkModeContext.jsx";

const DELIVERY_CHARGES = 250;

const CheckOutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { darkMode } = useDarkMode();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border border-gray-700",
        inputBg:
          "bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] border border-gray-600 focus:ring-[#F59E0B]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border border-gray-200",
        inputBg:
          "bg-white text-[#111827] placeholder-[#4B5563] border border-gray-300 focus:ring-[#3B82F6]",
      };

  const product = location.state; // product data jo Buy Now se aaya hai

  if (!product) {
    return <div className={`p-10 ${theme.text} ${theme.bg}`}>No product selected for checkout</div>;
  }

  // 🧾 Subtotal & Total Calculation
  const subTotal = product.price * product.quantity;
  const totalAmount = subTotal + DELIVERY_CHARGES;

  const handleProceedToPay = () => {
    navigate("/PaymentSend", {
      state: {
        product,
        subTotal,
        deliveryCharges: DELIVERY_CHARGES,
        totalAmount,
      },
    });
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-10   min-h-screen ${theme.bg} ${theme.text}`}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">Checkout</h2>

      {/* 🔹 Responsive 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* 🛒 Product Info */}
          <div className={`flex items-start gap-4 p-4 rounded-lg ${theme.card}`}>
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <h3 className="font-medium text-lg line-clamp-2">{product.name}</h3>
              <p className="text-sm opacity-75">Qty: {product.quantity}</p>
              <p className="font-bold text-[#F59E0B] mt-1">Rs {subTotal}</p>
            </div>
          </div>

          {/* 📍 Address Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Delivery Address</h3>

            <div className={`p-4 rounded-lg text-sm sm:text-base ${theme.card}`}>
              {user?.address ? (
                <>
                  <p>
                    {user.address.street}, {user.address.city},{" "}
                    {user.address.state} - {user.address.postalCode}
                  </p>
                  <p>
                    {user.address.country} | {user.address.phone}
                  </p>

                  {/* ✏️ Edit Address Button */}
                  <div className="mt-3 flex justify-start sm:justify-end">
                    <button
                      onClick={() => navigate("/profile/address")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded text-sm sm:text-base"
                    >
                      Edit Address
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-red-500 mb-2">No address found. Please add one.</p>
                  <button
                    onClick={() => navigate("/profile/address")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded text-sm sm:text-base"
                  >
                    Add Address
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-1">
          {/* 💵 Order Summary */}
          <div className={`p-4 rounded-lg shadow-md sticky top-4 ${theme.card}`}>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Subtotal</span>
              <span>Rs {subTotal}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Delivery Charges</span>
              <span>Rs {DELIVERY_CHARGES}</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
              <span>Total</span>
              <span>Rs {totalAmount}</span>
            </div>

            {/* ✅ Proceed to Pay */}
            <button
              onClick={handleProceedToPay}
              className="w-full mt-4 py-3 bg-[#F59E0B] hover:[#F59E0B]-600 transition text-white rounded-lg text-base sm:text-lg"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
