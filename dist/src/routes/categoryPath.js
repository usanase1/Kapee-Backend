"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const categoryRouter = express_1.default.Router();
categoryRouter.post("/create", categoryController_1.createCategory);
categoryRouter.get("/", categoryController_1.getCategories);
exports.default = categoryRouter;
