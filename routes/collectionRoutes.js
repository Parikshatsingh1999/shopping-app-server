import express from "express";
import { getAllCollections, createCollection, getCollectionWithProducts, deleteCollection } from "../controllers/collectionController.js";
import { verifyToken, verifyIsAdmin } from "../controllers/authController.js";


const collectionRouter = express.Router();

collectionRouter.route("/").get(getAllCollections)
    .post(verifyToken, verifyIsAdmin, createCollection)

collectionRouter.route("/:collectionId").get(getCollectionWithProducts)
    .delete(verifyToken, verifyIsAdmin, deleteCollection);


export { collectionRouter }