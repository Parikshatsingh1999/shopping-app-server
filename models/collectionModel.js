import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const CollectionModel = mongoose.model("collection", collectionSchema);