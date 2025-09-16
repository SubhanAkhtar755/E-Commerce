// 📂 orders/routes.js
import express from "express";
import {
  createOrderController,
  getOrderByIdController,
  getAllOrdersController,
  updateOrderController,
  getUserOrdersController,
  cancelOrderController
} from "./controllers/orderController.js";
import authMiddleware from "../../middlewares/auth.js";
import { updatePaymentController } from "./controllers/paymentController.js";
import { getDeliveredRevenueController } from "../orders/controllers/calculateController.js";

import {
  requestReturnController,
  updateReturnStatusController,
} from "./controllers/returnController.js";
import { adminCheck } from "../../middlewares/adminCheck.js";


const router = express.Router();

// 🟢 Orders
router.post("/", authMiddleware, createOrderController); // create new order
router.get("/my", authMiddleware, getUserOrdersController);// 🟢 User orders
router.get("/:id",authMiddleware, getOrderByIdController); // get order by id
router.get("/", getAllOrdersController); // get all orders
router.put("/:id",authMiddleware , adminCheck ,  updateOrderController); // update order (status, etc.)

router.put("/:id/cancel", authMiddleware, cancelOrderController);

// 💳 Payment
router.put("/:id/payment", updatePaymentController); // update payment status

router.get("/revenue/cod", getDeliveredRevenueController); // 👈 example endpoint

// 📦 Returns
router.post("/:id/return", requestReturnController); // request a return
router.put("/:id/return/status", updateReturnStatusController); // update return status (admin)

export default router;
