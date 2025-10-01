"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const orderRouter = express_1.default.Router();
orderRouter.post("/place", orderController_1.placeOrder);
orderRouter.get("/:userId", orderController_1.getOrders);
exports.default = orderRouter;
