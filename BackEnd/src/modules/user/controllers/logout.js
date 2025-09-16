// src/modules/user/controllers/logout.js

import LogoutService from "../services/logout.js";

const LogoutController = (req, res) => {
    try {
        const result = LogoutService(res);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

export default LogoutController;
