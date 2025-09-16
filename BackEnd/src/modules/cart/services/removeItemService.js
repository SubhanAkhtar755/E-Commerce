import { removeCartItem } from "../db/index.js";

const removeItemService = async (userId, productId) => {
  const cart = await removeCartItem(userId, productId);

  if (!cart) {
    throw new Error("Cart or product not found");
  }

  return cart;
};

export default removeItemService;
