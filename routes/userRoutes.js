import express from "express";
import { getAllUsers, createUser, deleteUser } from "../controllers/userController.js";

const UserRouter = express.Router();

UserRouter.route("/").get(getAllUsers).post(createUser);

UserRouter.route("/:userId").delete(deleteUser)


export { UserRouter };