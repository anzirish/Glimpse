/**
 * Rate Limiter Middleware for Glimpse E-commerce Application
 * Uses in-memory store for rate limiting
 */

import rateLimit from "express-rate-limit";

// General API rate limiter - applies to all routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication routes (login)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Only 5 attempts per window
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiter for account creation
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // Only 3 signups per hour per IP
  message: "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password reset requests
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // Only 3 password reset requests per hour per IP
  message: "Too many password reset attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});
