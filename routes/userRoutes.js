import express from "express";
import { getAllUsers, createUser, deleteUser, getUserById } from "../controllers/userController.js";
import { verifyIsAdmin, verifyToken } from "../controllers/authController.js";

const UserRouter = express.Router();

UserRouter.route("/").get(getAllUsers)
    .post(verifyToken, verifyIsAdmin, createUser);

UserRouter.route("/:userId").get(getUserById)
    .delete(verifyToken, verifyIsAdmin, deleteUser)


export { UserRouter };