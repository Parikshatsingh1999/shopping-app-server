import jwt from "jsonwebtoken";
import crypto from "crypto";

const key = process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");

export const createToken = (payload) => {
    const token = jwt.sign(payload, key,)
    return token || null;
}

export const verifyToken = (req, res, next) => {
    const token = req.headers.auth;
    if (token) {
        try {
            const data = jwt.verify(token, key);
            req.user = data;
        } catch (error) {
            return res.status(401).json({ error: "User not authenticated" });
        }
    } else {
        return res.status(401).json({ error: "User not authenticated" });
    }
    next();
}

export const verifyUser = (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: "User Not Authenticated" });
    }
    next();
}