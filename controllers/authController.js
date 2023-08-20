import jwt from "jsonwebtoken";
import crypto from "crypto";

const key = process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");
const refreshKey = process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");

export const createToken = (payload) => {
    const token = jwt.sign(payload, key, { expiresIn: "1d" })
    return token || null;
}

export const createRefreshToken = (payload) => {
    const token = jwt.sign(payload, refreshKey, { expiresIn: "30d" })
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

const checkRefreshToken = (token) => {
    try {
        const data = jwt.verify(token, refreshKey);
        return data;
    } catch (error) {
        return false;
    }
}

export const verifyUser = (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: "User Not Authenticated" });
    }
    next();
}

export const verifyIsAdmin = (req, res, next) => {
    const role = req.user?.role;
    if (role !== 'admin') {
        return res.status(401).json({ error: "User Not Authenticated" });
    }
    next();
}

export const verifyRefreshToken = (req, res, next) => {
    let tokenCookie = req.headers.cookie?.toString();
    let token = "";
    if (!tokenCookie?.includes("refreshToken")) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    token = tokenCookie.split("refreshToken")?.[1]?.split("Bearer")?.[1]?.trim();

    if (!token) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    const user = checkRefreshToken(token);
    if (user) {
        const token = createToken({ id: user.id, username: user.username, role: user.role });
        return res.status(200).json({ accessToken: token });
    } else {
        return res.status(401).json({ error: "User not authenticated" });
    }
}