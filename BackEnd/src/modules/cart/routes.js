import express from "express";
import authMiddleware from "../../middlewares/auth.js";

import addToCart from "./controllers/addToCartController.js";
import getUserCart from "./controllers/getCartController.js";
import updateCartItem from "./controllers/updateCartController.js";
import removeCartItem from "./controllers/removeItemController.js";
import clearCart from "./controllers/clearCartController.js";

const router = express.Router();

// ✅ Protected Routes (cart is user-specific)
router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getUserCart);
router.put("/update/:productId", authMiddleware, updateCartItem);
router.delete("/remove/:productId", authMiddleware, removeCartItem);
router.delete("/clear", authMiddleware, clearCart);

export default router;
