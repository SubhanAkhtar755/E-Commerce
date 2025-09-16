import Model from "../models/index.js";
import bcrypt from "bcrypt";
import generateAuthToken from "../../../utils/generateAuthToken.js";

const LoginService = async (email, password) => {
    // 1. Find user by email
    const user = await Model.findOne({ email }).select("+password");

    if (!user) throw new Error("Email not found");

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect password");

    // 3. Generate JWT token
  const token = await generateAuthToken(user);

    // 4. Return user without password
    user.password = undefined;

    return { token, user };
};

export default LoginService;
