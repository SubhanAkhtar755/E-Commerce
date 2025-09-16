// 📂 pages/AdminOrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDarkMode } from "../../context/DarkModeContext";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  // 🎨 Theme setup
  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        border: "border-gray-700",
        card: "bg-[#1F2937] border border-gray-700",
        tableHeader: "bg-[#374151]",
        tableRowHover: "hover:bg-[#2D3748]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        border: "border-gray-300",
        card: "bg-white border border-gray-200",
        tableHeader: "bg-gray-100",
        tableRowHover: "hover:bg-gray-50",
      };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/api/orders/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to fetch order details");
        console.log(err.response?.data || err.message);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <SpinnerOverlay />;

  return (
    <div className={`p-4 sm:p-4  ${theme.bg} ${theme.text}`}>
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      {/* Basic Info */}
      <div className={`p-4 rounded-lg mb-6 shadow ${theme.card}`}>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>User:</strong> {order.user?.name || "Unknown"}
        </p>
        <p>
          <strong>Email:</strong> {order.user?.email || "N/A"}
        </p>
        <p>
          <strong>Total Amount:</strong> ${order.totalAmount}
        </p>
        <p>
          <strong>Status:</strong> {order.orderStatus}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
      </div>

      {/* Shipping Address */}
      <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
      <div className={`p-4 rounded-lg mb-6 shadow ${theme.card}`}>
        <p>
          {order.shippingAddress.street}, {order.shippingAddress.city}
        </p>
        <p>
          {order.shippingAddress.state}, {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
        <p>
          <strong>Phone:</strong> {order.shippingAddress.phone}
        </p>
      </div>

      {/* Ordered Products */}
      <h3 className="text-lg font-semibold mb-2">Products</h3>

      {/* Web Table */}
      <div className="hidden sm:block">
        <table
          className={`w-full rounded-lg overflow-hidden shadow border ${theme.border}`}
        >
          <thead>
            <tr className={`${theme.tableHeader} ${theme.text}`}>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((p, idx) => (
              <tr
                key={idx}
                className={`text-center cursor-pointer ${theme.tableRowHover}`}
                onClick={() => navigate(`/ProductsDetails/${p.product._id}`)}
              >
                <td className="p-2 border">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover mx-auto rounded cursor-pointer"
                  />
                </td>
                <td className="p-2 border ">{p.name}</td>
                <td className="p-2 border">{p.brand}</td>
                <td className="p-2 border">${p.price}</td>
                <td className="p-2 border">{p.quantity}</td>
                <td className="p-2 border">
                  ${(p.price * p.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {order.products.map((p, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-lg shadow cursor-pointer ${theme.card}`}
            onClick={() => navigate(`/ProductsDetails/${p.product._id}`)}
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-semibold line-clamp-2">{p.name}</h4>

              <p className={`${theme.secondary} text-sm`}>{p.brand}</p>
              <p className="text-sm">
                ${p.price} × {p.quantity} ={" "}
                <span className="font-semibold">
                  ${(p.price * p.quantity).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderDetails;
