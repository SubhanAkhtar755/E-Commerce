import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDarkMode } from "../../context/DarkModeContext.jsx";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx"; // ✅ spinner component

const STATUS_STEPS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Returned",
];

const OrderHistoryDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { darkMode } = useDarkMode();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border-gray-700",
        secondary: "text-gray-400",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border-gray-200",
        secondary: "text-gray-600",
      };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`https://e-commerce-h7o7.onrender.com/api/orders/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to fetch order history detail");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ✅ Spinner overlay
  if (loading) return <SpinnerOverlay />;

  if (!order)
    return <p className="p-6 text-center text-red-500">Order not found</p>;

  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className={`mx-auto p-6 space-y-8 ${theme.bg} ${theme.text}`}>
      <h2 className="text-3xl font-bold text-center border-b pb-3">
        Order Detail
      </h2>

      {/* Order Status Timeline */}
      <section>
        <h3 className="text-xl font-semibold border-b mb-3 pb-1">
          Order Status
        </h3>
        <div className="relative flex items-center justify-between">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center relative"
              >
                {idx < STATUS_STEPS.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 z-0 ${
                      isCompleted ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold z-10 ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {idx + 1}
                </div>
                <p
                  className={`mt-2 text-sm text-center ${
                    isCompleted ? "text-blue-600 font-medium" : "text-gray-400"
                  }`}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Order Info */}
      <section>
        <h3 className="text-xl font-semibold border-b mb-3 pb-1">
          Order Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-y-2 text-sm">
          <p>
            <span className="font-medium">Order ID:</span> {order._id}
          </p>
          <p>
            <span className="font-medium">Placed At:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Total Amount:</span> Rs.{" "}
            {order.totalAmount}
          </p>
          <p>
            <span className="font-medium">Payment:</span> {order.paymentMethod} (
            {order.paymentStatus})
          </p>
          <p>
            <span className="font-medium">Status:</span> {order.orderStatus}
          </p>
        </div>
      </section>

      {/* Shipping */}
      <section>
        <h3 className="text-xl font-semibold border-b mb-3 pb-1">
          Shipping Address
        </h3>
        <p className="text-sm">
          {order.shippingAddress?.city}, {order.shippingAddress?.street},{" "}
          {order.shippingAddress?.state} - {order.shippingAddress?.postalCode},{" "}
          {order.shippingAddress?.country} |
          <span className="ml-1 font-medium">
            📞 {order.shippingAddress?.phone}
          </span>
        </p>
      </section>

      {/* Products */}
      <section>
        <h3 className="text-xl font-semibold border-b mb-3 pb-1">
          Ordered Products
        </h3>
        <div className="space-y-4">
          {order.products.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-3 rounded border ${theme.card}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded border"
              />
              <div>
                <p className="font-medium text-sm sm:text-base line-clamp-2">
                  {item.name}
                </p>
                <p className={`text-xs ${theme.secondary}`}>
                  Brand: {item.brand}
                </p>
                <p className={`text-xs ${theme.secondary}`}>
                  Qty: {item.quantity} | Price: Rs.{item.price}
                </p>
                {item.discountprice && (
                  <p className={`text-xs ${theme.secondary}`}>
                    Discount: Rs.{item.discountprice}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OrderHistoryDetailPage;
