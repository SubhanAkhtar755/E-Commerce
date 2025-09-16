import getAllUsersService from "../services/getAllUsers.js";

const getAllUsersController = async (req, res) => {
  try {
    // sirf admin check
    if (!req.user) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getAllUsersController;
