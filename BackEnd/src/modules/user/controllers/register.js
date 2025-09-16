import PostService from "../services/register.js";
import { POST_DATA_MESSAGE, INTERNAL_SERVER_ERROR_MESSAGE } from "../../../constants/index.js";

const RegisterController = async (req, res) => {
    try {
        const Data = await PostService(req.body, req.files); // 👈 processed data from service
        const { token, user, message } = Data;

        // ❌ yahan cookie set mat karo

        // ✅ sirf response bhejo
        res.status(200).send({
            status: 200,
            message: message || POST_DATA_MESSAGE,
            user,
            token, // frontend ko use krny k liye bhej do
        });
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: INTERNAL_SERVER_ERROR_MESSAGE,
            error: err.message,
        });
    }
};

export default RegisterController;
