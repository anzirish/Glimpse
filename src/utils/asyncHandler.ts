/**
 * Async Handler Utility for Glimpse E-commerce Application
 * Wraps async functions to automatically catch and forward errors
 */

import { NextFunction, Request, Response } from "express";

// Type definition for async controller functions
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Async handler wrapper to catch errors automatically
// Returns a new async function that wraps the original with error handling
export const asyncHandler = (fn: AsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
