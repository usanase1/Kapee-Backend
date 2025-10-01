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
exports.resendVerification = exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.logout = exports.getAllUsers = exports.login = exports.signin = void 0;
const userModel_1 = require("../models/userModel");
const tokenGeneration_1 = require("../utils/tokenGeneration");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullname, userRole } = req.body;
        const existingUser = yield userModel_1.User.findOne({ email });
        if (existingUser) {
            // If user exists but is not verified, allow resending OTP when previous one expired
            if (!existingUser.emailVerified) {
                const now = new Date();
                // If code missing or expired, generate and send a new one
                if (!existingUser.verificationExpires || existingUser.verificationExpires <= now) {
                    const rawCode = (Math.floor(100000 + Math.random() * 900000)).toString();
                    const codeHash = crypto_1.default.createHash("sha256").update(rawCode).digest("hex");
                    existingUser.verificationCode = codeHash;
                    existingUser.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
                    yield existingUser.save();
                    const html = `<p>You already started registration.</p>
                        <p>Your new verification code is: <strong>${rawCode}</strong></p>
                        <p>This code will expire in 15 minutes.</p>`;
                    yield (0, sendEmail_1.default)(email, "New verification code", html);
                    return res.status(200).json({
                        message: "A new verification code has been sent to your email"
                    });
                }
                // Code still valid
                return res.status(400).json({
                    message: "Verification code already sent. Please check your email or use /resend-verification"
                });
            }
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.User({ fullname, email, password: hashedPassword, userRole });
        // Generate email verification code (6 digits) and store its hash + expiry (15 min)
        const rawCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        const codeHash = crypto_1.default.createHash("sha256").update(rawCode).digest("hex");
        newUser.verificationCode = codeHash;
        newUser.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
        newUser.emailVerified = false;
        const token = (0, tokenGeneration_1.generateAccessToken)(newUser);
        newUser.accessToken = token;
        yield newUser.save();
        // Send verification email
        const html = `<p>Welcome, ${fullname}!</p>
                  <p>Your verification code is: <strong>${rawCode}</strong></p>
                  <p>This code will expire in 15 minutes.</p>`;
        yield (0, sendEmail_1.default)(email, "Verify your email", html);
        return res.status(201).json({
            message: "User created successfully. Please verify your email.",
            newUser: { fullname, email }
        });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.signin = signin;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield userModel_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found, please register" });
        }
        if (!existingUser.emailVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = (0, tokenGeneration_1.generateAccessToken)(existingUser);
        existingUser.accessToken = token;
        yield existingUser.save();
        return res.status(200).json({ message: "User logged in successfully", existingUser });
    }
    catch (error) {
        return res.status(400).json({ message: "Error in user login", error });
    }
});
exports.login = login;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.User.find();
        return res.status(200).json({ message: "Users fetched successfully", users });
    }
    catch (error) {
        return res.status(400).json({ message: "Error in fetching users", error });
    }
});
exports.getAllUsers = getAllUsers;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }
        const user = yield userModel_1.User.findOne({ accessToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid token or user not found" });
        }
        user.accessToken = "";
        yield user.save();
        return res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error in logout", error });
    }
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: "If an account exists, a reset email has been sent" });
        }
        const rawToken = crypto_1.default.randomBytes(32).toString("hex");
        const tokenHash = crypto_1.default.createHash("sha256").update(rawToken).digest("hex");
        user.passwordResetToken = tokenHash;
        user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        yield user.save();
        const resetUrl = `${(_a = process.env.FRONTEND_URL) !== null && _a !== void 0 ? _a : "http://localhost:3000"}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
        const html = `<p>You requested a password reset.</p>
                  <p>Click the link below to reset your password (valid for 1 hour):</p>
                  <p><a href="${resetUrl}">${resetUrl}</a></p>`;
        yield (0, sendEmail_1.default)(email, "Password Reset", html);
        return res.status(200).json({ message: "If an account exists, a reset email has been sent" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error sending reset email", error });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, email, newPassword } = req.body;
        if (!token || !email || !newPassword) {
            return res.status(400).json({ message: "token, email and newPassword are required" });
        }
        const tokenHash = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = yield userModel_1.User.findOne({
            email,
            passwordResetToken: tokenHash,
            passwordResetExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        user.password = yield bcryptjs_1.default.hash(newPassword, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.accessToken = "";
        yield user.save();
        return res.status(200).json({ message: "Password has been reset successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error resetting password", error });
    }
});
exports.resetPassword = resetPassword;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        if (!email || !code)
            return res.status(400).json({ message: "email and code are required" });
        const user = yield userModel_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid request" });
        if (user.emailVerified)
            return res.status(200).json({ message: "Email already verified" });
        const codeHash = crypto_1.default.createHash("sha256").update(code).digest("hex");
        if (user.verificationCode !== codeHash || !user.verificationExpires || user.verificationExpires <= new Date()) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }
        user.emailVerified = true;
        user.verificationCode = undefined;
        user.verificationExpires = undefined;
        yield user.save();
        return res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error verifying email", error });
    }
});
exports.verifyEmail = verifyEmail;
const resendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "email is required" });
        const user = yield userModel_1.User.findOne({ email });
        if (!user)
            return res.status(200).json({ message: "If an account exists, a verification email has been sent" });
        if (user.emailVerified)
            return res.status(200).json({ message: "Email already verified" });
        const rawCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        const codeHash = crypto_1.default.createHash("sha256").update(rawCode).digest("hex");
        user.verificationCode = codeHash;
        user.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
        yield user.save();
        const html = `<p>Your new verification code is: <strong>${rawCode}</strong></p>
                  <p>This code will expire in 15 minutes.</p>`;
        yield (0, sendEmail_1.default)(email, "Verify your email", html);
        return res.status(200).json({ message: "If an account exists, a verification email has been sent" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error resending code", error });
    }
});
exports.resendVerification = resendVerification;
