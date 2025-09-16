// middleware/adminCheck.js
export const adminCheck = (req, res, next) => {
  try {
    const userEmail = req.user?.email; // JWT se aata hai

    if (userEmail !== "muhammadsubhan192128@gmail.com") {
      return res.status(403).json({ message: "Access denied. Admin only!" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
