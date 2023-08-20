import express from "express";
import { getSingleProduct, createProduct, getAllProducts, deleteProduct } from "../controllers/productController.js";
import { verifyToken, verifyIsAdmin } from "../controllers/authController.js";

const ProductRouter = express.Router();

ProductRouter.route("/").post(verifyToken, verifyIsAdmin, createProduct)

ProductRouter.route("/all").get(verifyToken, getAllProducts)

ProductRouter.route("/:productId")
    .get(getSingleProduct)
    .delete(verifyToken, verifyIsAdmin, deleteProduct);

export { ProductRouter };