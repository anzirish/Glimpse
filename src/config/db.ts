/**
 * MongoDB database configuration
 * Handles database connection for Glimpse e-commerce application
 */

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Get mongodb uri from enviorment variable
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI)
      throw new Error("Mongo uri is not defined in environment variables");

    // connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }

  // Handle connection event
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDb connected");
  });

  // Handle error event
  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error", error);
  });
};
