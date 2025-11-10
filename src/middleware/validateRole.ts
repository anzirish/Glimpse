/**
 * Role Validation Middleware for Glimpse E-commerce Application
 * Validates user roles for protected routes
 */

import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse";

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user exists (should be set by validateAuth middleware)
  if (!req.user) {
    return errorResponse(res, "Authentication required", 401);
  }

  // Check if user has admin role
  if (req.user.role !== "admin") {
    return errorResponse(res, "Access denied. Admin privileges required", 403);
  }

  next();
};
