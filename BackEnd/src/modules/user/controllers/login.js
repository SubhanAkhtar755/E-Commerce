import { LOGIN_SUCCESS, INVALID_CREDENTIALS, INTERNAL_SERVER_ERROR_MESSAGE } from "../../../constants/index.js";
import LoginService from "../services/login.js";

const LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await LoginService(email, password);

        // ✅ Production ke liye (Render + Netlify)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,      // hamesha true rakho kyunki HTTPS hai
            sameSite: "None",  // cross-site cookie ke liye required
        });


        res.status(200).send({
            status: 200,
            message: LOGIN_SUCCESS,
            user,
            token,
        });
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message || INTERNAL_SERVER_ERROR_MESSAGE,
        });
    }
};

export default LoginController;
