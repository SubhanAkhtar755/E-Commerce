// 📂 pages/Profile/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay";
import { useDarkMode } from "../../context/DarkModeContext.jsx";

const TABS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

const Orders = () => {
  const { user } = useUser();
  const { darkMode } = useDarkMode();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5;

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        card: "bg-[#1F2937] border border-gray-700",
        tabActive: "bg-blue-600 text-white",
        tabInactive: "bg-[#374151] text-[#D1D5DB] hover:bg-[#4B5563]",
        orderStatus: {
          Pending: "bg-yellow-700 text-yellow-100",
          Processing: "bg-blue-700 text-blue-100",
          Shipped: "bg-purple-700 text-purple-100",
          Delivered: "bg-green-700 text-green-100",
          Cancelled: "bg-red-700 text-red-100",
          Returned: "bg-gray-700 text-gray-100",
        },
        empty:
          "border border-gray-600 bg-[#1F2937] text-gray-400 rounded-lg p-10 text-center",
        btnCancel: "bg-gray-600 text-white hover:bg-gray-700",
        btnReturn:
          "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        card: "bg-white border border-gray-200",
        tabActive: "bg-blue-600 text-white",
        tabInactive: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        orderStatus: {
          Pending: "bg-yellow-100 text-yellow-700",
          Processing: "bg-blue-100 text-blue-700",
          Shipped: "bg-purple-100 text-purple-700",
          Delivered: "bg-green-100 text-green-700",
          Cancelled: "bg-red-100 text-red-700",
          Returned: "bg-gray-100 text-gray-700",
        },
        empty:
          "border border-dashed border-gray-300 bg-gray-50 text-gray-400 rounded-lg p-10 text-center",
        btnCancel: "bg-gray-500 text-white hover:bg-gray-600",
        btnReturn:
          "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
      };

  // 🔄 Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4001/api/orders/my", {
          withCredentials: true,
        });
        setOrders(res.data || []);
      } catch (err) {
        toast.error(
          "Failed to fetch orders: " +
            (err.response?.data?.error || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // ❌ Cancel order
  const handleCancel = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:4001/api/orders/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success("Order cancelled successfully");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "Cancelled" } : o
        )
      );
    } catch (err) {
      toast.error(
        "Cancel failed: " + (err.response?.data?.error || err.message)
      );
    }
  };

  // 🕒 Helper: check if 5 days passed
  const isReturnExpired = (deliveredAt) => {
    if (!deliveredAt) return true;
    const deliveredDate = new Date(deliveredAt);
    const now = new Date();
    const diffDays =
      (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 5;
  };

  // Filter orders
  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.orderStatus === activeTab);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <SpinnerOverlay />;
  }

  return (
    <div
      className={`pt-4 pb-10 max-w-6xl mx-auto min-h-screen ${theme.bg} ${theme.text}`}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">📦 My Orders</h2>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab ? theme.tabActive : theme.tabInactive
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders */}
      {paginatedOrders.length > 0 ? (
        <div className="flex flex-col gap-4">
         {paginatedOrders.map((order) => (
            <div
              key={order._id}
              className={`p-4 lg:mr-2 shadow-sm hover:shadow-md transition  ${theme.card}`}
            >
              {/* Top: Order ID + Status */}
              <div className="flex justify-between items-center border-b pb-2 mb-2 border-gray-500/30">
                <p className="text-sm font-medium">🆔 Order ID: {order._id}</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme.orderStatus[order.orderStatus] || "bg-gray-400 text-white"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Date/Time */}
              <p className="text-xs opacity-70 mb-3">
                📅 {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* Products */}
              <div
                className="flex items-center gap-3 cursor-pointer mb-3"
                onClick={() =>
                  order.orderStatus === "Returned"
                    ? navigate(`/orders/${order._id}/return-detail`)
                    : navigate(`/orders/${order._id}/history-detail`)
                }
              >
                <img
                  src={order.products[0]?.image || "/placeholder.png"}
                  alt={order.products[0]?.name}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm sm:text-base line-clamp-2">
                    {order.products[0]?.name}
                  </p>
                  <p className="text-xs opacity-70">
                    {order.products[0]?.brand}
                  </p>
                  <p className="text-xs opacity-70">
                    Qty: {order.products[0]?.quantity}
                  </p>
                  {order.products.length > 1 && (
                    <p className="text-xs text-blue-500">
                      +{order.products.length - 1} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom: Payment Method + Amount */}
              <div className="flex justify-between items-center border-t pt-2 mt-2 border-gray-500/30">
                <p className="text-xs opacity-70">
                  💳 Payment Method: {order.paymentMethod} ({order.paymentStatus})
                </p>
                <p className="font-semibold">Rs {order.totalAmount}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {order.orderStatus === "Delivered" && !order.isReturned && (
                  <button
                    onClick={() => {
                      if (isReturnExpired(order.deliveredAt)) {
                        toast.error(
                          "Return request period has expired (5 days passed)."
                        );
                        return;
                      }
                      navigate(`/orders/${order._id}/return`);
                    }}
                    disabled={isReturnExpired(order.deliveredAt)}
                    className={`px-3 py-1 rounded text-xs transition ${theme.btnReturn}`}
                  >
                    Request Return
                  </button>
                )}
                {order.orderStatus === "Pending" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className={`px-3 py-1 rounded text-xs transition ${theme.btnCancel}`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-400/30 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-400/30"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-400/30 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={theme.empty}>No {activeTab} orders yet.</div>
      )}
    </div>
  );
};

export default Orders;
