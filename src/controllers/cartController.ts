import Cart from "../models/cartModels";
import { Request, Response } from "express";

// Add product to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    const savedCart = await cart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Clear user's cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
