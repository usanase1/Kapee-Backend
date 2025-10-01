import Product from "../models/productModels";
import { Request, Response } from "express";

// Create Product
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

    const image = req.file ? `/images/${req.file.filename}` : null; // ✅ image path

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


// Get All Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get Product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
