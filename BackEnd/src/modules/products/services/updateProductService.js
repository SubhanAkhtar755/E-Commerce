import { getData, updateData } from "../db/index.js";
import cloudinary from "../../../utils/cloudinary.js";

const updateProductService = async (id, data = {}, files = {}) => {
  // purana product nikaal lo
  const existingProduct = await getData(id);
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  let images = existingProduct.images || [];

  // agar new images aaye to purani delete + nayi upload
  if (files.images) {
    // 🔥 purani images delete
    for (const img of images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // 🔥 new images upload
    const fileArray = Array.isArray(files.images) ? files.images : [files.images];
    images = [];

    for (const file of fileArray) {
      const uploadRes = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "shopvibe",
      });

      images.push({
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      });
    }
  }

  // safe update fields
  const productData = {
    name: data?.name ?? existingProduct.name,
    description: data?.description ?? existingProduct.description,
    price: data?.price ? Number(data.price) : existingProduct.price,
    stock: data?.stock ? Number(data.stock) : existingProduct.stock,
    images,
  };

  return await updateData(id, productData);
};

export default updateProductService;
