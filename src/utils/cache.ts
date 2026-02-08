/**
 * In-Memory Caching Utility for Glimpse E-commerce Application
 * Simple in-memory cache as Redis replacement
 */

// Simple in-memory cache store
interface CacheEntry {
  data: any;
  expiresAt: number;
}

const cacheStore = new Map<string, CacheEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.expiresAt < now) {
      cacheStore.delete(key);
    }
  }
}, 60000); // Clean every minute

// Get data from cache
export const getCache = async (key: string): Promise<any> => {
  try {
    const entry = cacheStore.get(key);
    if (!entry) return null;
    
    // Check if expired
    if (entry.expiresAt < Date.now()) {
      cacheStore.delete(key);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
};

// Set data in cache with expiration time (in seconds)
export const setCache = async (
  key: string,
  data: any,
  ttl: number = 300
): Promise<void> => {
  try {
    const expiresAt = Date.now() + (ttl * 1000);
    cacheStore.set(key, { data, expiresAt });
  } catch (error) {
    console.error("Cache set error:", error);
  }
};

// Delete single cache entry
export const deleteCache = async (key: string): Promise<void> => {
  try {
    cacheStore.delete(key);
  } catch (error) {
    console.error("Cache delete error:", error);
  }
};

// Delete multiple cache keys by pattern
export const deleteCachePattern = async (pattern: string): Promise<void> => {
  try {
    // Convert Redis pattern to regex
    const regexPattern = pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    
    for (const key of cacheStore.keys()) {
      if (regex.test(key)) {
        cacheStore.delete(key);
      }
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
