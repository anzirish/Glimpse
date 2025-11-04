/**
 * Cart Model for Glimpse E-commerce Application
 * Handles shopping cart items for users
 */

import mongoose, { Document, Schema, Types } from "mongoose";

// Cart interface extending Mongoose Document
interface ICart extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; 
  product: Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart schema definition with validation rules
const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create indexes for better query performance
cartSchema.index({ user: 1 }); // Index for user-based cart queries
cartSchema.index({ user: 1, product: 1 }, { unique: true }); // Prevent duplicate items per user

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
