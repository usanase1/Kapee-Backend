"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const userRouter = (0, express_1.default)();
userRouter.post("/userRegistration", userController_1.signin);
userRouter.post("/userLogin", userController_1.login);
userRouter.get("/getAllUsers", userController_1.getAllUsers);
userRouter.post("/userLogout", userController_1.logout);
userRouter.post("/forgot-password", userController_1.forgotPassword);
userRouter.post("/reset-password", userController_1.resetPassword);
userRouter.post("/verify-email", userController_1.verifyEmail);
userRouter.post("/resend-verification", userController_1.resendVerification);
exports.default = userRouter;
