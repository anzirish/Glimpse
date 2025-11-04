/**
 * Product Model for Glimpse E-commerce Application
 * Handles product catalog and inventory management
 */

import mongoose, { Schema, Document } from "mongoose";

// Product interface extending Mongoose Document
interface IProduct extends Document {
  category: string;
  name: string;
  price: number;
  image: string;
  ratingsCount: number;
  description: string;
  stock: number;
  reviews: mongoose.Types.ObjectId[]; // Array of review IDs
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Product schema definition with validation rules
const productSchema = new mongoose.Schema<IProduct>(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    stock: {
      type: Number, 
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: [0, "Ratings count cannot be negative"],
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// indexes for better query performance
productSchema.index({ category: 1 }); // Index for category-based queries
productSchema.index({ name: "text", description: "text" }); // Text search index
productSchema.index({ price: 1 }); // Index for price-based sorting

export const Product = mongoose.model<IProduct>("Product", productSchema);
