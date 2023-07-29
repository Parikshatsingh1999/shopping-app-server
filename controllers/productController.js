import { ProductModel } from "../models/productModel.js";

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
        return res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error?.message || "Somthing went wrong" });
    }

}

export async function createProduct(req, res) {
    const { title, price, description, currency, collectionId } = req.body;
    if (!title || !collectionId) {
        return res.send(400).json({ error: "Required data not provided" });
    }
    try {
        const product = await ProductModel.create({ title, price, collectionId, currency, description });
        return res.status(201).json({ success: "Product created", id: product.id });
    } catch (error) {
        res.status(500).json({ error: error?.message || "Somthing went wrong" });
    }
}

export async function getAllProducts(req, res) {
    try {
        const products = await ProductModel.find({});
        return res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error?.message || "Somthing went wrong" });
    }
}

export async function getAllCollectionProducts(collectionId) {
    if (!collectionId) {
        return [];
    }
    try {
        const products = await ProductModel.find({ collectionId });
        return products
    } catch (error) {
        return []
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
        res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}

export async function deleteAllCollectionProducts(collectionId) {
    if (!collectionId) {
        return
    }
    return await ProductModel.deleteMany({ collectionId });
}