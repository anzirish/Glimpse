/**
 * Rate Limiter Middleware for Glimpse E-commerce Application
 * Prevents abuse and brute force attacks using Redis store
 *
 * WHY REDIS?
 * - Without Redis: Rate limit data stored in server RAM (lost on restart)
 * - With Redis: Data persists across restarts and works with multiple servers
 * - Prevents attackers from bypassing limits by restarting server
 *
 * PACKAGES USED:
 * - express-rate-limit: Does the rate limiting logic
 * - rate-limit-redis: Bridge/adapter to connect express-rate-limit with Redis
 * - redis: The actual database that stores request counts
 */

import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis";

// Helper function to create Redis store only if client is ready
const createRedisStore = (prefix: string) => {
  try {
    if (redisClient.isReady) {
      return new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        prefix,
      });
    }
  } catch (error) {
    console.log(`Redis store not available for ${prefix}, using memory store`);
  }
  return undefined; // Falls back to memory store
};

// General API rate limiter - applies to all routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Send modern RateLimit-* headers (recommended)
  legacyHeaders: false, // Don't send old X-RateLimit-* headers
  // Redis store: Saves request counts in Redis instead of server memory
  // Benefits: Survives restarts, works with multiple servers
  store: createRedisStore("rl:api:"),
});

// Strict rate limiter for authentication routes (login)
// Prevents brute force password attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Only 5 attempts per window
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // SMART: Only count failed logins, not successful ones
  // This means legitimate users won't get blocked, only attackers
  store: createRedisStore("rl:auth:"),
});

// Rate limiter for account creation
// Prevents spam account creation and bot attacks
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window (stricter than login)
  max: 3, // Only 3 signups per hour per IP
  message:
    "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("rl:signup:"),
});

// Rate limiter for password reset requests
// Prevents abuse of forgot password feature (email spam)
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // Only 3 password reset requests per hour per IP
  message: "Too many password reset attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("rl:password:"),
});
