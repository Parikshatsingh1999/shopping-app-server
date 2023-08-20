import express from "express";
import { verifyRefreshToken, verifyIsAdmin } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post("/", verifyRefreshToken)

authRouter.get('/access', verifyIsAdmin, getCurrentUser)

export { authRouter }
