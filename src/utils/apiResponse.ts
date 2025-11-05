/**
 * API Response Utility Functions for Glimpse E-commerce Application
 * Provides standardized response formats for all API endpoints
 */

import { Response } from "express";

// Success response with data
export const successResponse = (
  res: Response,
  data: any,
  message: string = "Success",
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response without data
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// Validation error response with error details
export const validationErrorResponse = (
  res: Response,
  errors: any,
  message: string = "Validation failed",
  statusCode: number = 400
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
