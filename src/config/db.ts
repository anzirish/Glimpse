/**
 * MongoDB database configuration
 * Handles database connection for Glimpse e-commerce application
 */

import mongoose from "mongoose";

// Get MongoDB URI based on environment
const getMongoURI = (): string => {
  const nodeEnv = process.env.NODE_ENV;

  switch (nodeEnv) {
    case "production":
      return process.env.MONGODB_URI_PROD || "";
    case "test":
      return process.env.MONGODB_URI_TEST || "";
    case "development":
    default:
      return (
        process.env.MONGODB_URI_DEV || "mongodb://localhost:27017/glimpse_dev"
      );
  }
};

export const connectDB = async () => {
  try {
    // Get environment-specific MongoDB URI
    const mongoURI = getMongoURI();

    if (!mongoURI) {
      throw new Error(
        `MongoDB URI not defined for ${process.env.NODE_ENV} environment`
      );
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
