// backend/models/productModel.ts
import mongoose, { Document, Schema } from "mongoose";

interface Rating {
  rate: number;
  count: number;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  isOnSale: boolean;
  originalPrice: number;
  badge: string;
  inStock: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isOnSale: { type: Boolean, default: false },
    originalPrice: { type: Number },
    badge: { type: String },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
