import express from "express";
import { UserRouter } from "./userRoutes.js";
import { collectionRouter } from "./collectionRoutes.js";
import { ProductRouter } from "./productRoutes.js";
import { userLogin } from "../controllers/signInController.js"

const router = express.Router();


router.use("/users", UserRouter)

router.use("/collections", collectionRouter);

router.use("/products", ProductRouter)

router.post("/login", userLogin)


export { router }