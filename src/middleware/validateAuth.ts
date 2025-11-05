/**
 * Authentication Middleware for Glimpse E-commerce Application
 * Validates JWT tokens and attaches user data to request
 */

import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { errorResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import "../types"; // Import types to extend Request interface

export const validateAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from Authorization header
    const authHeader = req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return errorResponse(res, "Access token is required", 401);
    }

    // Verify token using JWT utility - asyncHandler will catch any errors
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  }
);
