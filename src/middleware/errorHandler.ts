/**
 * Global Error Handler Middleware for Glimpse E-commerce Application
 * Handles all errors and sends consistent error responses
 */

import { NextFunction, Request, Response } from "express";

// Global error handler middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = "Internal Server Error";

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // MongoDB validation errors
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors).map((val: any) => val.message).join(", ");
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyValue)[0];
    message = `${field} already exists`;
  }

  // MongoDB cast error (invalid ObjectId)
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Custom error messages
  if (error.message) {
    message = error.message;
  }

  // Set status code if error has statusCode property
  if (error.statusCode) {
    statusCode = error.statusCode;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
};
