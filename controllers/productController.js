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
        const result = {
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            currency: product.currency
        }
        return res.status(200).json(result);
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
        let products = await ProductModel.find({});
        products = products.map(item =>
        ({
            id: item._id,
            title: item.title,
            description: item.description,
            price: item.price,
        })
        )
        return res.status(200).json(products);
    } catch (error) {
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
        res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}

export async function deleteAllCollectionProducts(collectionId) {
    if (!collectionId) {
        return
    }
    return await ProductModel.deleteMany({ collectionId });
}