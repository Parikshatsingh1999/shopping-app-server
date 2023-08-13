import express from "express";
import { getSingleProduct, createProduct, getAllProducts, deleteProduct } from "../controllers/productController.js";
import { uploadFile } from "../controllers/fileUploadController.js";

const ProductRouter = express.Router();

ProductRouter.route("/").post(createProduct)

ProductRouter.route("/all").get(getAllProducts)

ProductRouter.route("/:productId").get(getSingleProduct).delete(deleteProduct);


export { ProductRouter };