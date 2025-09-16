import { deleteData } from "../db/index.js";
import cloudinary from "../../../utils/cloudinary.js";

const deleteAccountService = async (userId) => {
  const deletedUser = await deleteData(userId);

  if (!deletedUser) {
    throw new Error("User not found or already deleted");
  }

  // ✅ Delete image from Cloudinary if photo.public_id exists
  const publicId = deletedUser?.image?.public_id;

  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log("Image deleted from Cloudinary:", publicId);
    } catch (cloudErr) {
      console.error("Cloudinary deletion failed:", cloudErr.message);
    }
  }

  return deletedUser;
};

export default deleteAccountService;
