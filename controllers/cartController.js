import { CartModel } from "../models/cartModel.js";
import { ProductModel } from "../models/productModel.js";

export const getCart = async (req, res) => {
    const userId = req.user?.id;
    try {
        const cartExists = await CartModel.findOne({ userId })
        if (cartExists?._id) {
            const result = {
                cartItems: cartExists.cartItems,
                totalPrice: cartExists.totalPrice,
                totalItems: cartExists.totalItems,
            }
            return res.status(201).json(result);
        }
        else {
            const newCart = await CartModel.create({ userId, cartItems: [], totalPrice: 0, totalItems: 0 });
            if (newCart._id) {
                const result = {
                    cartItems: newCart.cartItems,
                    totalPrice: newCart.totalPrice,
                    totalItems: newCart.totalItems,
                }
                return res.status(201).json(result);
            } else {
                return res.status(500).json({ error: "Cart Couldnt be created" });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}

export const addItemToCart = async (req, res) => {
    const userId = req.user?.id;
    const { id: productId, quantity = 1, properties } = req.body;
    try {
        const cartExists = await CartModel.findOne({ userId })
        if (!cartExists?._id) {
            return res.status(500).json({ error: "Cart for this user is not created" });
        }
        const newCartData = await getUpdatedCartADD(cartExists, productId, quantity, properties)

        const newCart = await CartModel.findByIdAndUpdate({ _id: cartExists._id }, newCartData, { new: true });

        const result = {
            cartItems: newCart.cartItems,
            totalPrice: newCart.totalPrice,
            totalItems: newCart.totalItems,
        }
        return res.status(201).json(result)
    } catch (error) {
        return res.status(500).json({ error: error?.message || "Something went wrong" });
    }
}

const getUpdatedCartADD = async (cartData, productId, quan = 1, properties = {}) => {
    if (!cartData || !productId) {
        return cartData;
    }
    let quantity = Math.floor(quan) || 1;

    const productExits = cartData.cartItems.find(item => item.productId == productId);
    if (productExits) {
        productExits.quantity = (productExits.quantity || 1) + quantity;
        productExits.properties = productExits.properties ? { ...productExits.properties, ...properties } : { ...properties };
        return {
            cartItems: cartData.cartItems,
            totalItems: cartData.totalItems + quantity,
            totalPrice: productExits.price * quantity + cartData.totalPrice
        }
    }

    const getProduct = await ProductModel.findById({ _id: productId });

    return {
        cartItems: [...cartData.cartItems, {
            productId: getProduct._id,
            price: getProduct.price,
            title: getProduct.title,
            quantity,
            properties: { ...properties }
        }],
        totalPrice: cartData.totalPrice + (quantity * getProduct.price),
        totalItems: cartData.totalItems + quantity
    }
}

export const removeCartItem = async (req, res) => {

    const userId = req.user?.id;
    try {
        const { id: productId } = req.body;
        if (!productId) {
            return res.status(404).json({ error: "Product Id not provided" });
        }

        const cartExists = await CartModel.findOne({ userId })
        if (!cartExists?._id) {
            return res.status(500).json({ error: "Cart for this user is not created" });
        }

        const newCartData = await getUpdatedCartRemove(cartExists, productId)
        const newCart = await CartModel.findByIdAndUpdate({ _id: cartExists._id }, newCartData, { new: true });
        const result = {
            cartItems: newCart.cartItems,
            totalPrice: newCart.totalPrice,
            totalItems: newCart.totalItems,
        }
        return res.status(201).json(result)
    } catch (error) {
        return res.status(500).json({ error: error?.message || "Something went wrong" });
    }

}

const getUpdatedCartRemove = (cartData, productId) => {
    if (!cartData || !productId) {
        return cartData;
    }
    let itemToRemove = null;
    const filterCart = cartData.cartItems.filter(item => {
        if (item.productId == productId) {
            itemToRemove = item;
            return false;
        } else {
            return true
        }
    });

    if (itemToRemove) {
        return {
            cartItems: filterCart,
            totalItems: cartData.totalItems - (itemToRemove.quantity || 1),
            totalPrice: cartData.totalPrice - (itemToRemove.quantity * itemToRemove.price)
        }
    } else {
        return cartData;
    }

}

export const updateCartItem = async (req, res) => {
    const userId = req.user?.id;
    try {
        const { id: productId, quantity } = req.body;
        if (!productId) {
            return res.status(404).json({ error: "Product Id not provided" });
        }
        const cartExists = await CartModel.findOne({ userId })
        if (!cartExists?._id) {
            return res.status(500).json({ error: "Cart for this user is not created" });
        }
        const newCartData = await getUpdatedCartUpdate(cartExists, productId, quantity)
        const newCart = await CartModel.findByIdAndUpdate({ _id: cartExists._id }, newCartData, { new: true });
        const result = {
            cartItems: newCart.cartItems,
            totalPrice: newCart.totalPrice,
            totalItems: newCart.totalItems,
        }
        return res.status(201).json(result)
    } catch (error) {
        return res.status(500).json({ error: error?.message || "Something went wrong" });

    }
}

const getUpdatedCartUpdate = (cartData, productId, quantity) => {

    if (!cartData || !productId || !quantity || quantity <= 0) {
        return cartData;
    }

    const itemToUpdate = cartData.cartItems.find(item => productId == item.productId);

    cartData.totalItems = cartData.totalItems - itemToUpdate.quantity;
    cartData.totalPrice = cartData.totalPrice - (itemToUpdate.price * itemToUpdate.quantity);

    cartData.totalItems = cartData.totalItems + quantity;
    cartData.totalPrice = cartData.totalPrice + (quantity * itemToUpdate.price);
    itemToUpdate.quantity = quantity;
    return cartData;

}