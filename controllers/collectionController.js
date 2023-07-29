import { CollectionModel } from "../models/collectionModel.js";
import { getAllCollectionProducts, deleteAllCollectionProducts } from "./productController.js";

export async function getAllCollections(req, res) {
    try {
        const collections = await CollectionModel.find({});
        return res.status(200).json(collections);
    } catch (error) {
        return res.status(500).json({ error: error?.message || "somethig went wrong" });
    }
}

export async function createCollection(req, res) {
    const { title } = req.body;
    try {
        const newCollection = await CollectionModel.create({ title });
        return res.status(200).json({ success: "collection created", id: newCollection.id });
    } catch (error) {
        return res.status(500).json({ error: error?.message || "somethig went wrong" });
    }
}

export async function getSingleCollection(req, res) {
    const collectionId = req.params?.collectionId;
    if (!collectionId) {
        return res.status(404).json({ error: "Resource not found" });
    }
    try {
        getCollectionWithProducts(req, res);
        const collection = await CollectionModel.findById(collectionId);
        const colProducts = await getAllCollectionProducts(collectionId);
        const { title, _id } = collection
        if (!collection) {
            return res.status(401).json({ error: `collection with id - ${collectionId} not found` });
        }
        return res.status(200).json({ title, _id, products: colProducts });
    } catch (error) {
        return res.status(500).json({ error: error?.message || "somethig went wrong" });
    }
}

export async function getCollectionWithProducts(req, res) {
    const collectionId = req.params?.collectionId;
    if (!collectionId) {
        return res.status(404).json({ error: "Resource not found" });
    }
    try {
        const collection = await CollectionModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$_id", { $toObjectId: collectionId }]
                    }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'collectionId',
                    as: 'products'
                }
            }
        ]);
        return res.status(200).json(collection?.[0] || [])
    } catch (error) {
        return res.status(500).json({ error: error?.message || "somethig went wrong" });
    }
}

export async function deleteCollection(req, res) {
    const collectionId = req.params.collectionId;
    if (!collectionId) {
        res.send(204);
    }
    try {
        await CollectionModel.findByIdAndDelete(collectionId);
        await deleteAllCollectionProducts(collectionId);
        res.send(204);
    } catch (error) {
        res.status(500).json({ error: error?.message || "Something went wrong" });
    }

}