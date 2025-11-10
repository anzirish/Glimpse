/**
 * Redis Configuration for Glimpse E-commerce Application
 * Handles Redis connection for rate limiting and caching
 */

import { createClient } from "redis";

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Handle connection events
redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

// Connect to Redis
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully!");
  } catch (error) {
    console.error("Redis connection failed:", error);
    console.log("Continuing without Redis - using in-memory rate limiting");
  }
};

export default redisClient;
