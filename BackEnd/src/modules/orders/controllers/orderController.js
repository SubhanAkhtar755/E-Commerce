// 📂 orders/controllers/orderController.js
import {
  createNewOrder,
  fetchOrderById,
  fetchAllOrders,
  modifyOrder,
  fetchOrdersByUser,
  cancelOrderByUser,  // 👈 new import
} from "../services/orderService.js";

// 📂 orders/controllers/orderController.js
export const createOrderController = async (req, res) => {
  try {
    // 👈 user id cookie se middleware se aayega
    const orderData = {
      ...req.body,
      user: req.user.id, // ✅ attach logged-in user
    };

    const order = await createNewOrder(orderData);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderByIdController = async (req, res) => {
  try {
    const order = await fetchOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await fetchAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderController = async (req, res) => {
  try {
    const updated = await modifyOrder(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const cancelOrderController = async (req, res) => {
  try {
    const order = await cancelOrderByUser(req.params.id, req.user.id);
    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// 🆕 Get orders of logged-in user
export const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ authMiddleware se aata hai
    const orders = await fetchOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};