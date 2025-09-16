import UpdateService from "../services/update.js";

export const updateAccountController = async (req, res) => {
  try {
    const id = req.user.id; // ✅ User ID from auth middleware
    const data = req.body;   // text fields from FormData
    const file = req.files;  // ✅ image file from FormData

    const updatedUser = await UpdateService(id, data, file); // pass file

    res.status(200).json({
      message: "Account updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: "UpdateService Error: " + error.message });
  }
};
