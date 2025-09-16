import jwt from "jsonwebtoken";
import { ENV } from "../constants/index.js";

const authMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Check token in Authorization header
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ If not found, check cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3️⃣ If still not found → Unauthorized
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
