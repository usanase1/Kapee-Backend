import { createProduct, getProductById, getProducts, updateProduct, deleteProduct } from "../controllers/productController";
import express from "express";
import { requireSignin, checkAdmin } from "../middlewares/authenticationFunctions";
import upload from "../utils/multer";

const productRouter = express.Router();

// Use Multer middleware here for image upload
productRouter.post("/create", requireSignin, checkAdmin, upload.single("image"), createProduct);

productRouter.get("/getAllProducts", getProducts);
productRouter.get("/get/:id", getProductById);
productRouter.put("/edit/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);

export default productRouter;
