import mongoose, { Document, Schema } from "mongoose";

interface IOrderItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: string;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: Number }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", orderSchema);
