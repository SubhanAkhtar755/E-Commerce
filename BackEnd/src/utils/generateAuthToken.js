import jwt from "jsonwebtoken";
import { ENV } from "../constants/index.js";

const generateAuthToken = async (user) => {
  try {
    // JWT ke andar id + email dono bhejo
    const token = jwt.sign(
      { id: user._id, email: user.email },
      ENV.JWT_SECRET,
      { expiresIn: "7d" } // token expiry
    );

    return token;
  } catch (err) {
    throw new Error("Token generation failed: " + err.message);
  }
};

export default generateAuthToken;
