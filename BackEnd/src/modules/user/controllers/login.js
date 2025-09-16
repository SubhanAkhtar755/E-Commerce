import { LOGIN_SUCCESS, INTERNAL_SERVER_ERROR_MESSAGE } from "../../../constants/index.js";
import LoginService from "../services/login.js";

const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await LoginService(email, password);

    // ✅ Token cookie set karna
    res.cookie("token", token, {
      httpOnly: true,          // JS access nahi kar sakta
      secure: true,            // ✅ HTTPS ke liye
      sameSite: "None",        // ✅ Netlify + Render cross-site issue fix
      path: "/",               // ✅ har route pe accessible
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din valid
    });

    // ✅ Success response
    res.status(200).json({
      status: 200,
      message: LOGIN_SUCCESS,
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message || INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
};

export default LoginController;
