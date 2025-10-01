import Category from "../models/categoryModels";
import { Request, Response } from "express";

// Create Category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    const savedCategory = await newCategory.save();
    res.status(201).json({ message: "Category created", category: savedCategory });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
