import { UserModel } from "../models/userModel.js";
import { createToken, createRefreshToken } from "./authController.js"


export async function userLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Required data not provided" });
    }
    try {
        const user = await UserModel.findOne({ email, password });
        if (user?._id) {
            const token = createToken({ id: user._id, username: user.email, role: user.role });
            const refreshToken = createRefreshToken({ id: user._id, username: user.email, role: user.role })
            res.cookie("refreshToken", `Bearer${refreshToken}`, {
                secure: true,
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60
            });
            return res.status(200).json({ accessToken: token });
        }
        return res.status(401).json({ error: "User not found" });
    } catch (error) {
        return res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}

export const userLogout = async (req, res) => {
    res.status(200).json({ success: "Successfully logged out" });
}

