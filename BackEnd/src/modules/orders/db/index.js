// 📂 orders/db/index.js
import Order from "../models/index.js";

// 🟢 Get One Order by ID (with user + product populate)
const getOrderById = async (id) =>
  await Order.findById(id).populate("user").populate("products.product");

// 🟢 Get All Orders (admin side: dekh sakta sab + populate)
const getAllOrders = async () =>
  await Order.find().populate("user").populate("products.product");

// 🟢 Create New Order (user side)
const createOrder = async (data) => {
  const order = new Order(data);
  return await order.save();
};

// 🟡 Update Order (admin side) - with save() for middleware
const updateOrder = async (id, data) => {
  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found");

  // update fields from data
  Object.keys(data).forEach((key) => {
    order[key] = data[key];
  });

  // save triggers schema pre-save middleware
  return await order.save();
};


// 🟢 Request Return (user side reason + issue + images bhejega)
const requestReturn = async (id, { reason, issue, images }) => {
  const returnCode =
    "SV-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  return await Order.findByIdAndUpdate(
    id,
    {
      $set: {
        "returnRequest.requested": true,
        "returnRequest.requestedAt": new Date(),
        "returnRequest.reason": reason,
        "returnRequest.issue": issue, // 🆕 added issue field
        "returnRequest.images": images, // ✅ ab [{url, public_id}] ayega
        "returnRequest.returnCode": returnCode,
        "returnRequest.status": "Pending",
        orderStatus: "Returned",
      },
    },
    { new: true }
  )
    .populate("user")
    .populate("products.product");
};

// 🟡 Update Return Status (admin side: approve/reject/complete)
const updateReturnStatus = async (id, status) =>
  await Order.findByIdAndUpdate(
    id,
    { $set: { "returnRequest.status": status } },
    { new: true }
  ).populate("user").populate("products.product");


// 🆕 Get orders by user
const getOrdersByUser = async (userId) =>
  await Order.find({ user: userId })
    .populate("user")
    .populate("products.product")
    .sort({ createdAt: -1 });


export {
  getOrderById,
  getAllOrders,
  createOrder,
  updateOrder,
  requestReturn,
  updateReturnStatus,
   getOrdersByUser, // 👈 new export
};
