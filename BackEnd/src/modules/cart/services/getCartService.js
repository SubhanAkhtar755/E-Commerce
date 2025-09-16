import { getUserCart } from "../db/index.js";

const getCartService = async (userId) => {
  const cart = await getUserCart(userId);
  return cart || { userId, items: [] };
};

export default getCartService;
