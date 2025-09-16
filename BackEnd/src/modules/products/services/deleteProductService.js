import { getData, deleteData } from "../db/index.js";
import cloudinary from "../../../utils/cloudinary.js";

const deleteProductService = async (id) => {
  const product = await getData(id);
  if (!product) throw new Error("Product not found");

  // 🔥 Delete images from Cloudinary
  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  return await deleteData(id);
};

export default deleteProductService;
