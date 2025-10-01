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
exports.clearCart = exports.getCart = exports.addToCart = void 0;
const cartModels_1 = __importDefault(require("../models/cartModels"));
// Add product to cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = yield cartModels_1.default.findOne({ userId });
        if (!cart) {
            cart = new cartModels_1.default({ userId, items: [{ productId, quantity }] });
        }
        else {
            const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            }
            else {
                cart.items.push({ productId, quantity });
            }
        }
        const savedCart = yield cart.save();
        res.status(200).json(savedCart);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.addToCart = addToCart;
// Get user's cart
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const cart = yield cartModels_1.default.findOne({ userId }).populate("items.productId");
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.getCart = getCart;
// Clear user's cart
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield cartModels_1.default.findOneAndUpdate({ userId }, { items: [] });
        res.status(200).json({ message: "Cart cleared" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.clearCart = clearCart;
