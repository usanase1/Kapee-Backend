import express from "express";
import { addToCart, getCart, clearCart } from "../controllers/cartController";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.get("/:userId", getCart);
cartRouter.delete("/:userId/clear", clearCart);

export default cartRouter;
