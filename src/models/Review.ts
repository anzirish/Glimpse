/**
 * Review Model for Glimpse E-commerce Application
 * Handles product reviews and ratings
 */

import mongoose, { Types, Document, Schema } from "mongoose";

// Review interface extending Mongoose Document
interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number; 
  comment: string; 
  createdAt: Date;
  updatedAt: Date;
}

// Review schema definition with validation rules
const reviewSchema = new mongoose.Schema<IReview>(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxLength: [500, "Review cannot exceed 500 characters"],
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create indexes for better query performance
reviewSchema.index({ product: 1 }); // Index for product-based queries
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // Prevent duplicate reviews per user per product

export const Review = mongoose.model<IReview>("Review", reviewSchema);
