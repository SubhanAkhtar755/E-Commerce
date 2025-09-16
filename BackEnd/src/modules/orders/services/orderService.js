import { 
  getOrderById, 
  getAllOrders, 
  createOrder, 
  updateOrder,
  getOrdersByUser,
} from "../db/index.js";
import Order from "../models/index.js"; // direct model chahiye cancel ke liye

export const createNewOrder = async (data) => await createOrder(data);
export const fetchOrderById = async (id) => await getOrderById(id);
export const fetchAllOrders = async () => await getAllOrders();
export const modifyOrder = async (id, data) => await updateOrder(id, data);

// 🆕 user ke orders
export const fetchOrdersByUser = async (userId) => await getOrdersByUser(userId);

// 🆕 cancel order (sirf Pending ho to)
export const cancelOrderByUser = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // ✅ Sirf apna order cancel kar sakta hai
  if (order.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized: You can only cancel your own order");
  }

  // ✅ Cancel sirf Pending state me ho
  if (order.orderStatus !== "Pending") {
    throw new Error("Order cannot be cancelled. It is already processing/shipped.");
  }

  order.orderStatus = "Cancelled";
  await order.save();

  return order;
};
