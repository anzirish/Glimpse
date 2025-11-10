/**
 * Main Application File for Glimpse E-commerce Application
 * Configures Express server with middleware and routes
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import v1Routes from "./routes/v1/index";
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/db";
import { apiLimiter } from "./middleware/rateLimiter";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// API Routes
app.use("/api/v1", v1Routes);

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
