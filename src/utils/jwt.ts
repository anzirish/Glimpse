/**
 * JWT Utility Functions for Glimpse E-commerce Application
 * Handles token generation and verification for authentication
 */

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// JWT payload interface
export interface JWTPayload {
  userId: mongoose.Types.ObjectId;
  role: "user" | "admin";
  email: string;
}

// Generate refresh token (long-lived, typically 30 days)
export const generateRefreshToken = (payload: JWTPayload): string => {

  const jwtKey = process.env.JWT_REFRESH_SECRET;
  const jwtExpire = process.env.JWT_REFRESH_EXPIRE || "30d";

  // Ensure JWT secret is configured
  if (!jwtKey) {
    throw new Error(
      "JWT refresh secret must be defined in environment variables"
    );
  }

  // Sign and return the refresh token with user payload
  return jwt.sign(payload, jwtKey, { expiresIn: jwtExpire });
};

// Generate access token (short-lived, typically 7 days)
export const generateAccessToken = (payload: JWTPayload): string => {

  const jwtKey = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRE || "7d";

  // Ensure JWT secret is configured
  if (!jwtKey) {
    throw new Error("JWT secret must be defined in environment variables");
  }

  // Sign and return the access token with user payload
  return jwt.sign(payload, jwtKey, { expiresIn: jwtExpire });
};

// Verify access token and return decoded payload
export const verifyAccessToken = (token: string): JWTPayload => {

  const jwtKey = process.env.JWT_SECRET;

  // Ensure JWT secret is configured
  if (!jwtKey) {
    throw new Error("JWT secret must be defined in environment variables");
  }

  try {
    // Verify token signature and expiration, then cast to JWTPayload type
    return jwt.verify(token, jwtKey) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Verify refresh token and return decoded payload
export const verifyRefreshToken = (token: string): JWTPayload => {
  const jwtKey = process.env.JWT_REFRESH_SECRET;

  // Ensure JWT refresh secret is configured
  if (!jwtKey) {
    throw new Error(
      "JWT refresh secret must be defined in environment variables"
    );
  }

  try {
    // Verify token signature and expiration
    return jwt.verify(token, jwtKey) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

// Generate password reset token (short-lived, typically 15 minutes)
export const generateResetToken = (userId: string): string => {
  const jwtKey = process.env.JWT_RESET_SECRET;
  const jwtExpire = process.env.JWT_RESET_EXPIRE || "15m";

  // Ensure JWT reset secret is configured
  if (!jwtKey) {
    throw new Error(
      "JWT reset secret must be defined in environment variables"
    );
  }

  // Sign token with user ID as payload
  return jwt.sign({ userId }, jwtKey, { expiresIn: jwtExpire });
};

// Verify password reset token and return user ID
export const verifyResetToken = (token: string): string => {
  const jwtKey = process.env.JWT_RESET_SECRET;

  // Ensure JWT reset secret is configured
  if (!jwtKey) {
    throw new Error(
      "JWT reset secret must be defined in environment variables"
    );
  }

  try {
    // Verify token and extract user ID from payload
    const decoded = jwt.verify(token, jwtKey) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid or expired reset token");
  }
};
