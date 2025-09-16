import express from "express";
import multer from "multer";
import getProduct from "./controllers/getProduct.js";
import getAllProducts from "./controllers/getAllProducts.js";
import createProduct from "./controllers/createProduct.js";
import updateProduct from "./controllers/updateProduct.js";
import deleteProduct from "./controllers/deleteProduct.js";

import authMiddleware from "../../middlewares/auth.js";
import { adminCheck } from "../../middlewares/adminCheck.js";

const router = express.Router();



// ✅ Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// ✅ Protected Routes
router.post(
  "/",
  authMiddleware,
  adminCheck,
  createProduct
);
router.put("/:id", authMiddleware, adminCheck, updateProduct);
router.delete("/:id", authMiddleware, adminCheck, deleteProduct);

export default router;
