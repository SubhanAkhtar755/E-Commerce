import { LOGIN_SUCCESS, INVALID_CREDENTIALS, INTERNAL_SERVER_ERROR_MESSAGE } from "../../../constants/index.js";
import LoginService from "../services/login.js";

const LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await LoginService(email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,       // ✅ Render hamesha HTTPS deta hai
            sameSite: "None",   // ✅ Netlify (frontend) + Render (backend) cross-site hai
            path: "/",          // ✅ important, warna kuch browser block kar dete hain
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
