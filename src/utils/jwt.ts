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

// Generate refresh token (long-lived)
export const generateRefreshToken = (payload: JWTPayload): string => {
  const jwtKey = process.env.JWT_REFRESH_SECRET;
  const jwtExpire = process.env.JWT_REFRESH_EXPIRE || "30d";

  if (!jwtKey) {
    throw new Error(
      "JWT refresh secret must be defined in environment variables"
    );
  }

  return jwt.sign(payload, jwtKey, { expiresIn: jwtExpire });
};

// Generate access token (short-lived)
export const generateAccessToken = (payload: JWTPayload): string => {
  const jwtKey = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRE || "7d";

  if (!jwtKey) {
    throw new Error("JWT secret must be defined in environment variables");
  }

  return jwt.sign(payload, jwtKey, { expiresIn: jwtExpire });
};

// Verify access token
export const verifyAccessToken = (token: string): JWTPayload => {
  const jwtKey = process.env.JWT_SECRET;

  if (!jwtKey) {
    throw new Error("JWT secret must be defined in environment variables");
  }

  try {
    return jwt.verify(token, jwtKey) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  const jwtKey = process.env.JWT_REFRESH_SECRET;

  if (!jwtKey) {
    throw new Error(
      "JWT refresh secret must be defined in environment variables"
    );
  }

  try {
    return jwt.verify(token, jwtKey) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
