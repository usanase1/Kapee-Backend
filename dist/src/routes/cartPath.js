"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const cartRouter = express_1.default.Router();
cartRouter.post("/add", cartController_1.addToCart);
cartRouter.get("/:userId", cartController_1.getCart);
cartRouter.delete("/:userId/clear", cartController_1.clearCart);
exports.default = cartRouter;
