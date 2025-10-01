"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.placeOrder = void 0;
const orderModels_1 = __importDefault(require("../models/orderModels"));
const cartModels_1 = __importDefault(require("../models/cartModels"));
// Place an order
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const cart = yield cartModels_1.default.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0)
            return res.status(400).json({ message: "Cart is empty" });
        const totalPrice = cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
        const order = new orderModels_1.default({ userId, items: cart.items, totalPrice });
        yield order.save();
        // Clear cart after placing order
        cart.items = [];
        yield cart.save();
        res.status(201).json({ message: "Order placed successfully", order });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.placeOrder = placeOrder;
// Get all orders for a user
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const orders = yield orderModels_1.default.find({ userId }).populate("items.productId");
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.getOrders = getOrders;
