// 📂 pages/Profile/ReturnDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Copy, Info } from "lucide-react"; // copy + info icon
import { useDarkMode } from "../../context/DarkModeContext.jsx";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx";

// Order Status Steps
const STATUS_STEPS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Returned",
];

// Return Status Steps
const RETURN_STEPS = ["Pending", "Approved", "Rejected", "Completed"];

const ReturnDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const { darkMode } = useDarkMode();

  // ✅ Theme conditional
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
        const res = await axios.get(`https://e-commerce-1-f4a7.onrender.com/api/orders/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to fetch return order detail");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return <SpinnerOverlay />;
  if (!order)
    return <p className="p-6 text-center text-red-500">Order not found</p>;

  // ✅ copy return code
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const currentOrderStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
  const currentReturnStepIndex = RETURN_STEPS.indexOf(
    order.returnRequest?.status
  );

  return (
    <div
      className={` mx-auto p-6 space-y-8 ${theme.bg} ${theme.text}`}
    >
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-center border-b pb-3">
        Return Detail
      </h2>

      {/* ✅ Order Status Timeline */}
      <section>
        <h3 className="text-xl font-semibold border-b mb-3 pb-1">
          Order Status
        </h3>

        <div className="relative flex items-center justify-between">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentOrderStepIndex;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* ✅ Line (center to next center) */}
                {idx < STATUS_STEPS.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 z-0 ${
                      currentOrderStepIndex >= idx + 1
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}

                {/* ✅ Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold z-10 ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {idx + 1}
                </div>

                {/* ✅ Label */}
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

      {/* ✅ Return Status Timeline */}
      {order.returnRequest?.status && (
        <section>
          <h3 className="text-xl font-semibold border-b mb-3 pb-1">
            Return Status
          </h3>

          <div className="relative flex items-center justify-between">
            {RETURN_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentReturnStepIndex;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {/* ✅ Line (center to next center) */}
                  {idx < RETURN_STEPS.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 z-0 ${
                        currentReturnStepIndex >= idx + 1
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}

                  {/* ✅ Circle */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold z-10 ${
                      isCompleted
                        ? "bg-green-600 border-green-600 text-white"
                        : `${theme.card} ${theme.secondary}`
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* ✅ Label */}
                  <p
                    className={`mt-2 text-sm text-center ${
                      isCompleted
                        ? "text-green-600 font-medium"
                        : theme.secondary
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

     {/* ✅ Return Code + Copy + Info */}
{order.returnRequest?.returnCode && (
  <div
    className={`flex items-center justify-center gap-3 p-4 rounded-lg shadow relative border ${theme.card}`}
  >
    <span className="text-lg font-semibold">
      <span className="text-blue-600">
        {order.returnRequest.returnCode}
      </span>
    </span>

    {/* Copy Button */}
    <button
      onClick={() => handleCopy(order.returnRequest.returnCode)}
      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      title="Copy Code"
    >
      <Copy size={16} />
    </button>

    {/* Info Button */}
    <div className="relative">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
        title="Info"
      >
        <Info size={16} />
      </button>

      {/* Tooltip Box (upar ya neeche) */}
      {showInfo && (
        <>
          {/* Background overlay (kahin bhi click → close) */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowInfo(false)}
          />

         <div
  className={`fixed top-52 left-1/2 -translate-x-1/2 w-80 rounded-lg shadow-lg p-4 text-sm border z-50 ${theme.card}`}
>

            <h3 className="font-semibold text-blue-600 mb-1">📌 Suggestion</h3>
            <p className="mb-2">
              When submitting your parcel at TCS, please make sure the{" "}
              <b>return code is written on the parcel</b>. The return will
              be <b>accepted or rejected only if the code matches</b>.
            </p>

            {/* Return Address */}
            <div className={`border-t pt-2 text-xs ${theme.secondary}`}>
              <h4 className="font-semibold mb-1">Return Address</h4>
              <p>
                📍 Hasilpur, City Chock , Street No 5 , Punjab , 63000 PostalCode , 📞 03000886045
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}


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
            <span className="font-medium">Payment:</span> {order.paymentMethod}{" "}
            ({order.paymentStatus})
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
                <p className="font-medium line-clamp-2">{item.name}</p>
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

      {/* Return Request */}
      <section>
        <h3 className="text-xl font-semibold border-b mb-3 pb-1">
          Return Request
        </h3>
        {!order.returnRequest?.requested ? (
          <p className={theme.secondary}>
            No return request submitted for this order.
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Requested At:</span>{" "}
              {new Date(order.returnRequest?.requestedAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Reason:</span>{" "}
              {order.returnRequest?.reason}
            </p>
            <p>
              <span className="font-medium">Issue:</span>{" "}
              {order.returnRequest?.issue}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {order.returnRequest?.status}
            </p>

            {order.returnRequest?.status === "Pending" &&
              order.returnRequest?.images?.length > 0 && (
                <div>
                  <p className="font-medium mt-2">Proof Images:</p>
                  <div className="flex gap-3 flex-wrap mt-2">
                    {order.returnRequest.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={`return-img-${i}`}
                        className="w-28 h-28 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReturnDetailPage;
