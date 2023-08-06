import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    cartItems: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const CartModel = mongoose.model("cart", cartSchema);