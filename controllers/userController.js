import { UserModel } from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error?.message || "something went wrong" });
    }
}

export const createUser = async (req, res) => {
    const { firstName: first_name, lastName: last_name, email, password } = req.body;
    const role = 'user';
    try {
        const userExists = await UserModel.find({ email });
        if (userExists?.length) {
            return res.status(401).json({ error: `User with email - ${email} already exists` });
        }
        const newUser = await UserModel.create({ first_name, last_name, email, role, password });
        res.status(201).json({ success: "UserCreated", id: newUser.id });
    } catch (error) {
        res.status(500).json({ error: error?.message || "something wet wrong" });
    }
}

export async function deleteUser(req, res) {
    const userId = req.params.userId;
    if (!userId) {
        res.send(204);
    }
    try {
        await UserModel.findByIdAndDelete(userId);
        res.send(204);
    } catch (error) {
        res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}