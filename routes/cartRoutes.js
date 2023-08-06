import express from "express";
import { getCart, addItemToCart, removeCartItem, updateCartItem } from "../controllers/cartController.js";
import { verifyUser } from "../controllers/authController.js";

const cartRouter = express.Router();

cartRouter.route("/", verifyUser).get(getCart).post(addItemToCart)
cartRouter.post("/remove", removeCartItem);
cartRouter.post("/update", updateCartItem)

export { cartRouter }