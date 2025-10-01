"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productController_1 = require("../controllers/productController");
const express_1 = __importDefault(require("express"));
const authenticationFunctions_1 = require("../middlewares/authenticationFunctions");
const multer_1 = __importDefault(require("../utils/multer"));
const productRouter = express_1.default.Router();
// Use Multer middleware here for image upload
productRouter.post("/create", authenticationFunctions_1.requireSignin, authenticationFunctions_1.checkAdmin, multer_1.default.single("image"), productController_1.createProduct);
productRouter.get("/getAllProducts", productController_1.getProducts);
productRouter.get("/get/:id", productController_1.getProductById);
productRouter.put("/edit/:id", productController_1.updateProduct);
productRouter.delete("/delete/:id", productController_1.deleteProduct);
exports.default = productRouter;
