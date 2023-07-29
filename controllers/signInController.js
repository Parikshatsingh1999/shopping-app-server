import { UserModel } from "../models/userModel.js";

export async function userLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Required data not provided" });
    }
    try {
        const user = await UserModel.findOne({ email, password });
        if (user?._id) {
            return res.status(200).json(user || null);
        }
        return res.status(401).json({ error: "User not found" });
    } catch (error) {
        return res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}