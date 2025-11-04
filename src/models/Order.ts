/**
 * Order Model for Glimpse E-commerce Application
 * Handles order management and tracking
 */

import mongoose, { Document, Schema, Types } from "mongoose";

// Order interface extending Mongoose Document
interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  paymentStatus: "pending" | "paid" | "failed";
  deliveryDate?: Date; // Optional, will be set when shipped
  createdAt: Date;
  updatedAt: Date;
}

// Order schema definition with validation rules
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"]
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      required: true
    },
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
      trim: true
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed"],
      required: true
    },
    deliveryDate: {
      type: Date
      // Optional, will be set when order is shipped
    }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create indexes for better query performance
orderSchema.index({ user: 1 }); // Index for user-based order queries
orderSchema.index({ createdAt: -1 }); // Index for date-based sorting (newest first)
orderSchema.index({ status: 1 }); // Index for status-based queries
orderSchema.index({ product: 1 }); // Index for product-based queries

export const Order = mongoose.model<IOrder>("Order", orderSchema);