import { PostData } from "../db/index.js";
import cloudinary from "../../../utils/cloudinary.js";

const createProductService = async (data, files = {}) => {
  let images = [];

  // agar images aaye
  if (files.images) {
    // agar multiple files aaye
    const fileArray = Array.isArray(files.images) ? files.images : [files.images];

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

  const productData = {
    ...data,
    price: Number(data.price),
    stock: Number(data.stock),
    images,
  };

  return await PostData(productData);
};

export default createProductService;
