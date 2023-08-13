import { CollectionModel } from "../models/collectionModel.js";
import { ProductModel } from "../models/productModel.js";
import { uploadFile } from "./fileUploadController.js";

export async function getSingleProduct(req, res) {
    const productId = req.params?.productId;
    if (!productId) {
        res.status(404).json({ error: "Resource not found" });
    }
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(401).json({ error: `Product with id - ${productId} not found` });
        }
        const result = {
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            currency: product.currency,
            image: product.image
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log("error", error?.message);
        res.status(500).json({ error: error?.message || "Somthing went wrong" });
    }
}

export async function createProduct(req, res) {
    uploadFile(req, res, async (error) => {

        if (error) {
            return res.status(404).json({ error: error?.message || "Error while saving product image" });
        }

        const { title, price, description, currency, collectionId } = req.body;
        if (!currency) {
            currency = 'Rs.'
        }
        if (!title || !collectionId || !price) {
            return res.status(400).json({ error: "Required data not provided" });
        }
        try {
            const collectionExists = await CollectionModel.findById(collectionId);
            if (!collectionExists) {
                throw new Error("Colelction Doesn't exists");
            }
            let imagePath;
            if (req.file) {
                imagePath = req.file.path;
            }
            const product = await ProductModel.create({ title, price, collectionId, currency, description, image: `\\${imagePath}` });
            return res.status(201).json({ success: "Product created", id: product.id });
        } catch (error) {
            console.log("error", error?.message);
            res.status(500).json({ error: error?.message || "Somthing went wrong" });
        }
    })
}

export async function getAllProducts(req, res) {
    try {
        let products = await ProductModel.find({});
        products = products.map(item =>
        ({
            id: item._id,
            title: item.title,
            description: item.description,
            price: item.price,
            image: item.image,
            curreny: item.currency
        })
        )
        return res.status(200).json(products);
    } catch (error) {
        console.log("error", error?.message);
        res.status(500).json({ error: error?.message || "Somthing went wrong" });
    }
}

export async function deleteProduct(req, res) {
    const productId = req.params.productId;
    if (!productId) {
        res.send(204);
    }
    try {
        await ProductModel.findByIdAndDelete(productId);
        res.send(204);
    } catch (error) {
        console.log("error", error?.message);
        res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}

export async function deleteAllCollectionProducts(collectionId) {
    if (!collectionId) {
        return null;
    }
    try {
        return await ProductModel.deleteMany({ collectionId });
    } catch (error) {
        return null;
    }
}