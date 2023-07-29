import express from "express";
import { getAllCollections, createCollection, getCollectionWithProducts, deleteCollection } from "../controllers/collectionController.js";

const collectionRouter = express.Router();

collectionRouter.route("/").get(getAllCollections).post(createCollection)

collectionRouter.route("/:collectionId").get(getCollectionWithProducts).delete(deleteCollection);


export { collectionRouter }