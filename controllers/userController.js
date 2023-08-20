import { UserModel } from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}).sort({ "createdAt": -1 });
        const usersList = users.map(item => ({
            id: item._id,
            firstName: item.first_name,
            lastName: item.last_name,
            email: item.email,
            createdAt: item.createdAt
        }))
        return res.status(200).json(usersList);
    } catch (error) {
        return res.status(500).json({ error: error?.message || "something went wrong" });
    }
}

export const getCurrentUser = async (req, res) => {
    if (!req.user?.id) {
        return res.status(500).json({ error: "User not found" })
    }
    try {
        const user = await UserModel.findById(req.user?.id)
        if (user) {
            return res.status(200).json({ user: { firstName: user.first_name, lastName: user.last_name, email: user.email } });
        } else {
            await res.status(500).json({ error: "User not found" })
        }
    } catch (error) {
        await res.status(500).json({ error: "User not found" })
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
        return res.status(201).json({ success: "UserCreated", id: newUser.id });
    } catch (error) {
        return res.status(500).json({ error: error?.message || "something wet wrong" });
    }
}

export async function getUserById(req, res) {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(500).json({ error: "User not found" })
    }
    try {
        const user = await UserModel.findById(userId)
        if (user) {
            return res.status(200).json({ firstName: user.first_name, lastName: user.last_name, email: user.email });
        } else {
            await res.status(500).json({ error: "User not found" })
        }

    } catch (error) {
        return res.status(500).json({ error: error?.message || "something wet wrong" });
    }
}

export async function deleteUser(req, res) {
    const userId = req.params.userId;
    if (!userId) {
        res.send(204);
    }
    try {
        await UserModel.findByIdAndDelete(userId);
        return res.send(204);
    } catch (error) {
        return res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}