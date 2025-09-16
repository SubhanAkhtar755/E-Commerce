// src/modules/user/services/logout.js

const LogoutService = (res) => {
    try {
        // Clear the cookie named "token"
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None", // or "Lax" for development
        });

        return {
            status: 200,
            message: "User logged out successfully",
        };
    } catch (error) {
        throw new Error("Logout failed: " + error.message);
    }
};

export default LogoutService;
