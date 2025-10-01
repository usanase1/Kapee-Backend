"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessToken: { type: String },
    userRole: { enum: ['user', 'admin'], default: 'user', type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    emailVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpires: { type: Date }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
