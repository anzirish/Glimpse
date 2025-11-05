/**
 * Role-based Authorization Middleware for Glimpse E-commerce Application
 * Checks if authenticated user has specific role permissions
 */

import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse";
import "../types"; // Import types to extend Request interface

// Admin role authorization middleware
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check if user exists (should be set by validateAuth middleware)
  if (!req.user) {
    return errorResponse(res, "Authentication required", 401);
  }

  // Check if user is admin
  if (req.user.role === "admin") {
    next();
  } else {
    return errorResponse(res, "Admin access required", 403);
  }
};
