import { clearCart } from "../db/index.js";
import Cart from "../models/index.js";

const clearCartService = async (userId) => {
  const cart = await clearCart(userId);
  return cart || new Cart({ userId, items: [] });
};

export default clearCartService;
