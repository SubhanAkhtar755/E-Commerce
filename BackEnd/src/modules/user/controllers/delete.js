import deleteAccountService from "../services/delete.js";

export const deleteAccountController = async (req, res) => {
  try {
    const userId = req.user.id; // auth middleware se aya hua
    await deleteAccountService(userId);
    res.status(200).json({ message: "Account deleted permanently" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
