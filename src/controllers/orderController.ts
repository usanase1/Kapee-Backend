import Order from "../models/orderModels";
import Cart from "../models/cartModels";
import { Request, Response } from "express";

// Place an order
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const totalPrice = cart.items.reduce(
      (acc, item) => acc + (item.productId as any).price * item.quantity,
      0
    );

    const order = new Order({ userId, items: cart.items, totalPrice });
    await order.save();

    // Clear cart after placing order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all orders for a user
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate("items.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
