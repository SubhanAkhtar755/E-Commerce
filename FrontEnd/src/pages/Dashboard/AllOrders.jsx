// 📂 pages/Admin/AllOrders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDarkMode } from "../../context/DarkModeContext.jsx";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        border: "border-gray-700",
        card: "bg-[#1F2937] border border-gray-700",
        btnActive: "bg-blue-600 text-white",
        btnInactive: "bg-gray-700 text-gray-200",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        border: "border-gray-300",
        card: "bg-white border border-gray-200",
        btnActive: "bg-blue-600 text-white",
        btnInactive: "bg-gray-200 text-gray-700",
      };

  // 🔹 Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (error) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 🔹 Update Order Status
  const updateStatus = async (id, orderStatus) => {
    setLoading(true);
    try {
      await axios.put(
        `/api/orders/${id}`,
        { orderStatus },
        { withCredentials: true }
      );
      toast.success("Order status updated");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? {
                ...o,
                orderStatus:
                  orderStatus === "Delivered" ? "Completed" : orderStatus,
              }
            : o
        )
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update Return Status
  const updateReturnStatus = async (id, returnStatus) => {
    setLoading(true);
    try {
      await axios.put(
        `/api/orders/${id}/return/status`,
        { status: returnStatus },
        { withCredentials: true }
      );
      toast.success("Return status updated");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? {
                ...o,
                orderStatus:
                  returnStatus === "Completed" || returnStatus === "Rejected"
                    ? "Completed"
                    : o.orderStatus,
                returnRequest: { ...o.returnRequest, status: returnStatus },
              }
            : o
        )
      );
    } catch {
      toast.error("Failed to update return status");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Order counts by status
  const counts = orders.reduce((acc, o) => {
    if (
      o.orderStatus === "Completed" ||
      o.orderStatus === "Delivered" ||
      o.returnRequest?.status === "Completed" ||
      o.returnRequest?.status === "Rejected"
    ) {
      acc["Completed"] = (acc["Completed"] || 0) + 1;
    } else {
      acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    }
    return acc;
  }, {});

  // 🔹 Filtered orders
  const filteredOrders =
    filter === "All"
      ? orders
      : filter === "Completed"
      ? orders.filter(
          (o) =>
            o.orderStatus === "Completed" ||
            o.orderStatus === "Delivered" ||
            o.returnRequest?.status === "Completed" ||
            o.returnRequest?.status === "Rejected"
        )
      : filter === "Delivered"
      ? [] // ✅ Delivered tab empty
      : filter === "Returned"
      ? orders.filter(
          (o) =>
            o.orderStatus === "Returned" &&
            o.returnRequest?.status !== "Completed"
        )
      : orders.filter((o) => o.orderStatus === filter);

  if (loading) return <SpinnerOverlay />;

  return (
    <div className={`pt-5 p-4 min-h-screen ${theme.bg} ${theme.text}`}>
      <h2 className="text-xl font-bold mb-4">All Orders</h2>

      {/* 🔹 Summary Counts */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          "All",
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Returned",
          "Completed",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded text-sm transition ${
              filter === status ? theme.btnActive : theme.btnInactive
            }`}
          >
            {status} ({status === "All" ? orders.length : counts[status] || 0})
          </button>
        ))}
      </div>

      {/* 🔹 Orders Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className={`w-full border ${theme.border}`}>
          <thead>
            <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">PayStatus</th>
              <th className="p-2 border">Return</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o._id} className="text-center">
                <td className="p-2 border">{o._id}</td>
                <td className="p-2 border">{o.user?.name || "Unknown"}</td>
                <td className="p-2 border">Rs {o.totalAmount}</td>
                <td className="p-2 border">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>

                {/* Order Status Dropdown */}
                <td className="p-2 border">
                  <select
                    value={o.orderStatus || "Pending"}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`border p-1 rounded ${theme.bg} ${theme.text}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </td>

                {/* Payment */}
                <td className="p-2 border">{o.paymentMethod || "COD"}</td>
                <td className="p-2 border">{o.paymentStatus || "-"}</td>

                {/* Return Request */}
                <td className="p-2 border">
                  {o.orderStatus === "Returned" && o.returnRequest ? (
                    <select
                      value={o.returnRequest.status}
                      onChange={(e) =>
                        updateReturnStatus(o._id, e.target.value)
                      }
                      className={`border p-1 rounded ${theme.bg} ${theme.text}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    "—"
                  )}
                </td>

                {/* View Button */}
                <td className="p-2 border">
                  <button
                    onClick={() => {
                      if (o.orderStatus === "Returned") {
                        navigate(`/Dashboard/admin/orders/returned/${o._id}`);
                      } else {
                        navigate(`/Dashboard/admin/orders/${o._id}`);
                      }
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Mobile Cards */}
      <div className="grid md:hidden gap-4">
        {filteredOrders.map((o) => (
          <div
            key={o._id}
            className={`p-4 rounded-lg shadow ${theme.card}`}
          >
            <p className="text-sm font-bold">Order ID: {o._id}</p>
            <p>User: {o.user?.name || "Unknown"}</p>
            <p>Amount: Rs {o.totalAmount}</p>
            <p>Date: {new Date(o.createdAt).toLocaleDateString()}</p>
            <p>Status: {o.orderStatus}</p>
            <p>Payment: {o.paymentMethod || "COD"}</p>
            <p>PayStatus: {o.paymentStatus || "-"}</p>
            <p>
              Return:{" "}
              {o.orderStatus === "Returned" && o.returnRequest
                ? o.returnRequest.status
                : "—"}
            </p>
            <button
              onClick={() =>
                navigate(
                  o.orderStatus === "Returned"
                    ? `/Dashboard/admin/orders/returned/${o._id}`
                    : `/Dashboard/admin/orders/${o._id}`
                )
              }
              className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
