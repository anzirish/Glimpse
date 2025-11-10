/**
 * Redis Caching Utility for Glimpse E-commerce Application
 * Handles caching operations to reduce database load and improve performance
 */

import redisClient from "../config/redis";

// Get data from cache
export const getCache = async (key: string): Promise<any> => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
};

// Set data in cache with expiration time
export const setCache = async (
  key: string,
  data: any,
  ttl: number = 300
): Promise<void> => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error("Cache set error:", error);
  }
};

// Delete single cache entry
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Cache delete error:", error);
  }
};

// Delete multiple cache keys by pattern
export const deleteCachePattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("Cache pattern delete error:", error);
  }
};

// Cache expiration times in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};
