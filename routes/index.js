import express from "express";
import { UserRouter } from "./userRoutes.js";
import { collectionRouter } from "./collectionRoutes.js";
import { ProductRouter } from "./productRoutes.js";
import { cartRouter } from "./cartRoutes.js";
import { userLogin } from "../controllers/signInController.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.route("/login").post(userLogin);

router.use("/users", UserRouter)

router.use("/collections", collectionRouter);

router.use("/products", ProductRouter)

router.use("/cart", verifyToken, cartRouter)

export { router }