import { Router } from "express";
import userRoutes from '../modules/user/routes.js';
import productsRoutes from '../modules/products/routes.js';
import cartRoutes from '../modules/cart/routes.js';
import ordersRoutes from '../modules/orders/routes.js';
import paymentRoutes from '../payment/routes.js';

const router = Router();

router.use('/user',  userRoutes)
router.use('/products',  productsRoutes)
router.use('/cart',  cartRoutes)
router.use('/orders',  ordersRoutes)
router.use('/payment',  paymentRoutes)



export default router;