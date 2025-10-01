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
exports.checkAdmin = exports.requireSignin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const requireSignin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "Server config error: JWT secret missing" });
        }
        const authHeader = (req.headers.authorization || req.headers.Authorization || "").toString();
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
        if (!token) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        let verifytoken;
        try {
            verifytoken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (err) {
            const reason = (err === null || err === void 0 ? void 0 : err.name) === "TokenExpiredError" ? "Token expired" : "Invalid token";
            return res.status(401).json({ message: reason });
        }
        const rootuser = yield userModel_1.User.findById(verifytoken._id);
        if (!rootuser || rootuser.accessToken !== token) {
            return res.status(401).json({ message: "Invalid or revoked session" });
        }
        req.user = rootuser;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authorization required" });
    }
});
exports.requireSignin = requireSignin;
const checkAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userRole) !== "admin") {
        return res.status(403).json({ message: "User not Authorized" });
    }
    next();
};
exports.checkAdmin = checkAdmin;
