import { addOrUpdateCart } from "../db/index.js";
import Product from "../../products/models/index.js"; 

const addToCartService = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (!product.name || !product.price) {
    const error = new Error("Invalid product data");
    error.statusCode = 400;
    throw error;
  }

  const item = {
    productId,
    name: product.name,
    brand: product.brand || "",
    price: product.price,
    discountprice: product.discountprice || 0, // ✅ schema jaisa
    image: product.images?.[0]?.url || "https://via.placeholder.com/150",
    quantity,
  };

  return await addOrUpdateCart(userId, item);
};

export default addToCartService;
