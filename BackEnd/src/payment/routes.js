import { Router } from "express";
import jazzcashRoutes from "./jazzcash.js";
import easypaisaRoutes from "./easypaisa.js";


const router = Router();

// JazzCash routes
router.use("/jazzcash", jazzcashRoutes);

router.use("/easypaisa", easypaisaRoutes);

export default router; 
