"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // ✅ one cart per user
    },
    items: [
        {
            productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1, min: 1 }, // ✅ validation
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Cart", cartSchema);
