import { CollectionModel } from "../models/collectionModel.js";
import { deleteAllCollectionProducts } from "./productController.js";

export async function getAllCollections(req, res) {
    try {
        let collections = await CollectionModel.find({}).sort({ "createdAt": -1 });;
        collections = collections.map(item => ({
            id: item._id,
            title: item.title,
        }))
        return res.status(200).json(collections);
    } catch (error) {
        return res.status(500).json({ error: error?.message || "somethig went wrong" });
    }
}

export async function createCollection(req, res) {
    const { title, description } = req.body;
    try {
        const newCollection = await CollectionModel.create({ title, description });
        return res.status(200).json({ success: "collection created", id: newCollection.id });
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
        const collectionList = await CollectionModel.aggregate([
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
                    as: 'products',
                    pipeline: [
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                    ]
                },
            },
        ]);
        let response = {};
        if (collectionList?.[0]) {
            let collection = collectionList[0];
            response.id = collection._id;
            response.title = collection.title;
            response.products = collection.products.map(item =>
            ({
                id: item._id,
                title: item.title,
                description: item.description,
                price: item.price,
                currency: item.currency,
                image: item.image
            })
            )
        }
        return res.status(200).json(response)
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