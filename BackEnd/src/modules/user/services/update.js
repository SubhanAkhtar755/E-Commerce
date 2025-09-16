import { updateData, getData } from "../db/index.js";
import bcrypt from "bcrypt";
import cloudinary from "../../../utils/cloudinary.js";

const UpdateService = async (id, updatedFields, file) => {
  try {
    // 1️⃣ Hash password if present
    if (updatedFields.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updatedFields.password, saltRounds);
      updatedFields.password = hashedPassword;
    }

    // 2️⃣ Fetch current user from DB
    const currentUser = await getData(id); // ✅ getData se current user
    if (!currentUser) throw new Error("User not found");

    // 3️⃣ Handle image update
    if (file && file.image) {
      // Agar pehle se image hai to delete karo
      if (currentUser.image?.public_id) {
        await cloudinary.uploader.destroy(currentUser.image.public_id);
      }

      // Nayi image upload karo
      const result = await cloudinary.uploader.upload(file.image.tempFilePath, {
        folder: "usershopvibe",
        quality: "auto",
        fetch_format: "auto",
        transformation: [{ width: 500, crop: "scale" }],
      });

      updatedFields.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // 4️⃣ Update DB
    const updatedUser = await updateData(id, updatedFields);
    if (!updatedUser) throw new Error("Update failed");

    updatedUser.password = undefined; // hide password
    return updatedUser;
  } catch (error) {
    throw new Error("UpdateService Error: " + error.message);
  }
};

export default UpdateService;
