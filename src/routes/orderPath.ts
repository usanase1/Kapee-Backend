import express from "express";
import { placeOrder, getOrders } from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/place", placeOrder);
orderRouter.get("/:userId", getOrders);

export default orderRouter;
