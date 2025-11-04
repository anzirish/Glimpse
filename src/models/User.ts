/**
 * User Model for Glimpse E-commerce Application
 * Handles user authentication and profile management
 */

import mongoose from "mongoose";
import { Document } from "mongoose";
import bcrypt from "bcryptjs";

// User interface extending Mongoose Document
interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin"; // Restrict to specific roles
  address: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(inputPassword: string): Promise<boolean>;
}

// User schema definition with validation rules
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [100, "Name can't exceed 100 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't include password in queries by default
      minLength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create unique index on email field for faster queries and uniqueness
userSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware to hash password before saving to database
userSchema.pre("save", async function (next) {
  // Only hash password if it's been modified
  if (!this.isModified("password")) return next();

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error occurred while hashing password:", error);
    next(error as Error);
  }
});

// Instance method to compare input password with hashed password
userSchema.methods.comparePassword = async function (
  inputPassword: string
): Promise<boolean> {
  return bcrypt.compare(inputPassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
