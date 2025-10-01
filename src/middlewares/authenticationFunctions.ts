import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

export const requireSignin = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET ?? "";
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "Server config error: JWT secret missing" });
    }

    const authHeader = (req.headers.authorization || (req.headers as any).Authorization || "").toString();
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    let verifytoken: any;
    try {
      verifytoken = jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
      const reason = err?.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
      return res.status(401).json({ message: reason });
    }

    const rootuser = await User.findById(verifytoken._id);
    if (!rootuser || rootuser.accessToken !== token) {
      return res.status(401).json({ message: "Invalid or revoked session" });
    }

    req.user = rootuser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authorization required" });
  }
};

export const checkAdmin = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (req.user?.userRole !== "admin") {
    return res.status(403).json({ message: "User not Authorized" });
  }
  next();
};