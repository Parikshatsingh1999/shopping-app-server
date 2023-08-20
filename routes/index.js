import express from "express";
import { UserRouter } from "./userRoutes.js";
import { collectionRouter } from "./collectionRoutes.js";
import { ProductRouter } from "./productRoutes.js";
import { cartRouter } from "./cartRoutes.js";
import { authRouter } from "./authRouter.js";
import { userLogin, userLogout } from "../controllers/signInController.js";
import { verifyToken, verifyIsAdmin } from "../controllers/authController.js";

const router = express.Router();


router.route("/login").post(userLogin);

router.route('/logout').post(verifyToken, userLogout)

router.use("/auth", verifyToken, authRouter)

router.use("/users", UserRouter)

router.use("/collections", collectionRouter);

router.use("/products", ProductRouter)

router.use("/cart", verifyToken, cartRouter)

export { router }