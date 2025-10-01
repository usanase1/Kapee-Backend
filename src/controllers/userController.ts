import { User } from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../utils/tokenGeneration";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import mailerSender from "../utils/sendEmail";

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullname, userRole } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists but is not verified, allow resending OTP when previous one expired
      if (!existingUser.emailVerified) {
        const now = new Date();

        // If code missing or expired, generate and send a new one
        if (!existingUser.verificationExpires || existingUser.verificationExpires <= now) {
          const rawCode = (Math.floor(100000 + Math.random() * 900000)).toString();
          const codeHash = crypto.createHash("sha256").update(rawCode).digest("hex");
          existingUser.verificationCode = codeHash;
          existingUser.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
          await existingUser.save();

          const html = `<p>You already started registration.</p>
                        <p>Your new verification code is: <strong>${rawCode}</strong></p>
                        <p>This code will expire in 15 minutes.</p>`;
          await mailerSender(email, "New verification code", html);

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

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({ fullname, email, password: hashedPassword, userRole });

    // Generate email verification code (6 digits) and store its hash + expiry (15 min)
    const rawCode = (Math.floor(100000 + Math.random() * 900000)).toString();
    const codeHash = crypto.createHash("sha256").update(rawCode).digest("hex");
    newUser.verificationCode = codeHash;
    newUser.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
    newUser.emailVerified = false;

    const token = generateAccessToken(newUser);
    newUser.accessToken = token;
    await newUser.save();

    // Send verification email
    const html = `<p>Welcome, ${fullname}!</p>
                  <p>Your verification code is: <strong>${rawCode}</strong></p>
                  <p>This code will expire in 15 minutes.</p>`;
    await mailerSender(email, "Verify your email", html);

    return res.status(201).json({
      message: "User created successfully. Please verify your email.",
      newUser: { fullname, email }
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found, please register" });
    }
    if (!existingUser.emailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }
    const isPasswordMatched = await bcryptjs.compare(password, existingUser.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateAccessToken(existingUser);
    existingUser.accessToken = token;
    await existingUser.save();
    return res.status(200).json({ message: "User logged in successfully", existingUser });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error in user login", error: error?.message ?? error });
  }
};


export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    return res.status(400).json({ message: "Error in fetching users", error });
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const user = await User.findOne({ accessToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token or user not found" });
    }
    user.accessToken = "";
    await user.save();

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in logout", error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "If an account exists, a reset email has been sent" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
    const html = `<p>You requested a password reset.</p>
                  <p>Click the link below to reset your password (valid for 1 hour):</p>
                  <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    await mailerSender(email, "Password Reset", html);

    return res.status(200).json({ message: "If an account exists, a reset email has been sent" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending reset email", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) {
      return res.status(400).json({ message: "token, email and newPassword are required" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      email,
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.accessToken = "";
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "email and code are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid request" });
    if (user.emailVerified) return res.status(200).json({ message: "Email already verified" });

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (user.verificationCode !== codeHash || !user.verificationExpires || user.verificationExpires <= new Date()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.emailVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying email", error });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "If an account exists, a verification email has been sent" });
    if (user.emailVerified) return res.status(200).json({ message: "Email already verified" });

    const rawCode = (Math.floor(100000 + Math.random() * 900000)).toString();
    const codeHash = crypto.createHash("sha256").update(rawCode).digest("hex");
    user.verificationCode = codeHash;
    user.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const html = `<p>Your new verification code is: <strong>${rawCode}</strong></p>
                  <p>This code will expire in 15 minutes.</p>`;
    await mailerSender(email, "Verify your email", html);

    return res.status(200).json({ message: "If an account exists, a verification email has been sent" });
  } catch (error) {
    return res.status(500).json({ message: "Error resending code", error });
  }
};
