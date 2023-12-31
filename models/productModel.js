import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: 'collection',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    currency: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });

export const ProductModel = mongoose.model("product", productSchema);