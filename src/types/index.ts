// Import the JWT payload type that we'll add to Request
import { JWTPayload } from "../utils/jwt";

/**
 * Extend Express Request type to include custom properties
 * This uses TypeScript's "Declaration Merging" feature
 */
declare global {
  // Target the Express namespace (where all Express types live)
  namespace Express {
    // Extend the existing Request interface (doesn't replace, just adds to it)
    interface Request {
      // Add 'user' property with JWTPayload type
      // Optional (?) because not all routes have authentication
      // Set by auth middleware after JWT verification
      user?: JWTPayload;
    }
  }
}

/**
 * This export makes the file a "module" instead of a "script"
 * Required for 'declare global' to work properly in TypeScript
 * Without this, TypeScript won't recognize our type extensions
 */
export {};