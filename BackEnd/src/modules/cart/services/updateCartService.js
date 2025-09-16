import { updateCartItem } from "../db/index.js";

const updateCartService = async (userId, productId, quantity) => {
  if (quantity < 1) throw new Error("Quantity must be at least 1");

  const cart = await updateCartItem(userId, productId, quantity);
  if (!cart) throw new Error("Cart or product not found");

  return cart;
};

export default updateCartService;
