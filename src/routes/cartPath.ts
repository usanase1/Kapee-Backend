import express from "express";
import { addToCart, getCart, clearCart } from "../controllers/cartController";
import { requireSignin } from "../middlewares/authenticationFunctions";

const cartRouter = express.Router();

// Only authenticated users can add products to cart
cartRouter.post("/add", requireSignin, addToCart);
cartRouter.get("/:userId", getCart);
cartRouter.delete("/:userId/clear", clearCart);

export default cartRouter;
