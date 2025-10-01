import { Document, Schema, model, Types } from "mongoose";

interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ✅ one cart per user
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, min: 1 }, // ✅ validation
      },
    ],
  },
  { timestamps: true }
);

export default model<ICart>("Cart", cartSchema);
