import { getData, updateData } from "../db/index.js";
import cloudinary from "../../../utils/cloudinary.js";
const updateProductService = async (id, data = {}, files = {}) => {
  const existingProduct = await getData(id);
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  let images = existingProduct.images || [];

  // agar new images aaye
  if (files.images) {
    for (const img of images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

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

  // ✅ Saare schema fields yahan map karo
  const productData = {
    name: data?.name ?? existingProduct.name,
    content: data?.content ?? existingProduct.content,
    price: data?.price !== undefined ? Number(data.price) : existingProduct.price,
    discountprice: data?.discountprice !== undefined ? Number(data.discountprice) : existingProduct.discountprice,
    stock: data?.stock !== undefined ? Number(data.stock) : existingProduct.stock,
    category: data?.category ?? existingProduct.category,
    sale: data?.sale !== undefined ? data.sale : existingProduct.sale,
    brand: data?.brand ?? existingProduct.brand,
    images,
  };

  return await updateData(id, productData);
};

export default updateProductService;
