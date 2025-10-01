import Product from "../models/productModels";
import { Request, Response } from "express";
import path from "path";

// Create Product with image upload
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      category,
      rating,
      isOnSale,
      originalPrice,
      badge,
      inStock,
    } = req.body;

    // Multer stores uploaded file here
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image,
      rating,
      isOnSale,
      originalPrice,
      badge,
      inStock,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
