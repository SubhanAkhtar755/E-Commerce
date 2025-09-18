import React from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useDarkMode } from "../../../context/DarkModeContext.jsx";
import { Link } from "react-router-dom";
import SpinnerOverlay from "../../../components/Important/SpinnerOverlay.jsx";

// ===== Skeleton Item =====
const SkeletonCartItem = ({ theme }) => (
  <div
    className={`flex gap-4 ${theme.card} w-full p-2 shadow-sm rounded animate-shimmer`}
  >
    <div className="w-20 h-20 bg-gray-400/20 rounded" />
    <div className="flex-1 flex flex-col gap-2 py-1">
      <div className="h-4 w-3/4 bg-gray-400/30 rounded"></div>
      <div className="h-3 w-1/2 bg-gray-400/30 rounded"></div>
      <div className="h-3 w-1/4 bg-gray-400/30 rounded mt-auto"></div>
    </div>
  </div>
);

const Cart = () => {
  const { darkMode } = useDarkMode();
  const {
    cart,
    loading,
    selectedItems,
    updateQuantity,
    removeItem,
    removeSelected,
    clearCart,
    toggleSelect,
  } = useCart();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border-gray-700",
        inputBg:
          "bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] border-gray-600 focus:ring-[#F59E0B]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border-gray-200",
        inputBg:
          "bg-white text-[#111827] placeholder-[#4B5563] border-gray-300 focus:ring-[#3B82F6]",
      };

  if (loading) {
    return (
      <div className={`min-h-screen relative ${theme.bg} p-6`}>
        <SpinnerOverlay show={true} />
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCartItem key={idx} theme={theme} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.bg} sm:p-6  min-h-screen ${theme.text}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold p-2">🛒 My Cart</h1>
          {selectedItems.length > 0 && (
            <button
              onClick={removeSelected}
              className="sm:hidden text-red-500 mr-5 hover:text-red-700"
            >
              <Trash2 size={22} />
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="flex flex-col gap-[3px]">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className={`flex gap-2 items-center ${theme.card} w-full p-2 shadow-sm rounded`}
                >
                  {/* Checkbox mobile (outside Link) */}
                  <div className="flex items-center justify-center sm:hidden h-20">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => toggleSelect(item.productId)}
                    />
                  </div>
                  {/* Link wrapping rest of the card */}
                  <Link
                    to={`/ProductsDetails/${item.productId}`}
                    className="flex gap-4 flex-1 hover:shadow-lg transition rounded"
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                       loading="lazy"
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex flex-col flex-1">
                      <h2 className="font-semibold text-sm sm:text-base line-clamp-2">
                        {item.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {item.brand || "No Brand"}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <div>
                          {item.discountprice > 0 ? (
                            <>
                              <p className="text-[#F59E0B] font-semibold text-sm sm:text-lg">
                                Rs. {item.discountprice}
                              </p>
                              <p className="line-through text-gray-400 text-xs sm:text-sm">
                                Rs. {item.price}
                              </p>
                            </>
                          ) : (
                            <p className="text-[#F59E0B] font-semibold text-sm sm:text-lg">
                              Rs. {item.price}
                            </p>
                          )}
                        </div>

                        <div className="flex sm:hidden items-center gap-2 border rounded px-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.productId, item.quantity - 1);
                            }}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1"
                          >
                            -
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.productId, item.quantity + 1);
                            }}
                            className="px-2 py-1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-4">
                      <div className="flex items-center gap-2 border rounded px-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.productId, item.quantity - 1);
                          }}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1"
                        >
                          -
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.productId, item.quantity + 1);
                          }}
                          className="px-2 py-1"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeItem(item.productId);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Total + Clear Cart */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-semibold">
                Total: Rs.{" "}
                {cart.reduce(
                  (sum, item) =>
                    sum +
                    (item.discountprice > 0
                      ? item.discountprice * item.quantity
                      : item.price * item.quantity),
                  0
                )}
              </h2>
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
