import { PostData } from "../db/index.js";
import bcrypt from "bcrypt";
import generateAuthToken from "../../../utils/generateAuthToken.js";

const RegisterService = async (data) => {
    try {
        // ✅ 1. Hash password if present
        if (data.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashedPassword;
        }

        // ✅ 2. Save user to DB (without image upload)
        const savedUser = await PostData(data);

        // ✅ 3. Generate JWT token
        const token = await generateAuthToken(savedUser._id);

        // ✅ 4. Return user + token
        return {
            message: "User registered successfully",
            user: {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                image: savedUser.image || null, // empty by default
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt
            },
            token
        };

    } catch (error) {
        throw new Error("RegisterService Error: " + error.message);
    }
};

export default RegisterService;
