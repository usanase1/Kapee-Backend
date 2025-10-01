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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const productModels_1 = __importDefault(require("../models/productModels"));
// Create Product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, category, rating, isOnSale, originalPrice, badge, inStock, } = req.body;
        const image = req.file ? `/images/${req.file.filename}` : null; // ✅ image path
        const newProduct = new productModels_1.default({
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
        const savedProduct = yield newProduct.save();
        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.createProduct = createProduct;
// Get All Products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModels_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.getProducts = getProducts;
// Get Product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModels_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.getProductById = getProductById;
// Update Product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, category, image, rating, isOnSale, originalPrice, badge, inStock, } = req.body;
        const updatedProduct = yield productModels_1.default.findByIdAndUpdate(req.params.id, {
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
        }, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res
            .status(200)
            .json({ message: "Product updated successfully", product: updatedProduct });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.updateProduct = updateProduct;
// Delete Product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedProduct = yield productModels_1.default.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.deleteProduct = deleteProduct;
