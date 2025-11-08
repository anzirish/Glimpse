/**
 * Authentication Controller for Glimpse E-commerce Application
 * Handles user registration, login, and profile management
 */

import { Request, Response } from "express";
import { User } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  JWTPayload,
  verifyResetToken,
} from "../utils/jwt";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { sendEmail } from "../services/emailService";

// User registration
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, address } = req.body;

  // Check for admin secret in headers
  const adminSecret = req.header("x-admin-secret");
  let userRole = "user";

  if (adminSecret) {
    if (adminSecret === process.env.ADMIN_SECRET) {
      userRole = "admin";
    } else {
      return errorResponse(res, "Invalid admin secret", 403);
    }
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, "User already exists with this email", 400);
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    address,
    role: userRole,
  });

  await user.save();

  // Generate tokens
  const payload: JWTPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Return user data without password
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
    accessToken,
    refreshToken,
  };

  const message =
    userRole === "admin"
      ? "Admin registered successfully"
      : "User registered successfully";

  return successResponse(res, userData, message, 201);
});

// User login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(res, "User is not registered", 401);
  }

  // Verify password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return errorResponse(res, "Password is incorrect", 401);
  }

  // Generate tokens
  const payload: JWTPayload = {
    userId: user._id,
    email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Return user data without password
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
    accessToken,
    refreshToken,
  };

  const message =
    user.role === "admin"
      ? "Admin logged in successfully"
      : "User logged in successfully";

  return successResponse(res, userData, message, 200);
});

// Get user profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  // req.user is guaranteed to exist due to validateAuth middleware
  const user = await User.findById(req.user!.userId);
  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  // Return user data without password
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
  };

  return successResponse(res, userData, "Profile retrieved successfully", 200);
});

// Update user profile
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, address } = req.body;

    // return if no data available for profile updation
    if (!name && !address) return;

    // req.user is guaranteed to exist due to validateAuth middleware
    const user = await User.findById(req.user!.userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Update only allowed fields (email should not be updatable for security)
    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    return successResponse(res, userData, "Profile updated successfully", 200);
  }
);

// Forgot password - sends reset link via email
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.body.email;

    // Validate email is provided
    if (!email) {
      return errorResponse(res, "Email is required to reset the password", 400);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return errorResponse(
        res,
        "We couldn't find user registered with this email",
        400
      );

    // Send password reset email with token
    await sendEmail(email, user._id.toString(), user.name);

    return successResponse(
      res,
      [],
      "Reset password link has been sent successfully",
      200
    );
  }
);

// Reset password using token from email
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.query.token?.toString();
    const password = req.body.password;

    // Validate password is provided
    if (!password) {
      return errorResponse(res, "Password is required", 400);
    }

    // Validate token is provided
    if (!token) {
      return errorResponse(
        res,
        "Reset token is required to reset the password",
        400
      );
    }

    // Verify token and extract user ID
    const userId = verifyResetToken(token);
    if (!userId) {
      return errorResponse(
        res,
        "Token is invalid or expired to reset the password",
        400
      );
    }

    // Find user by ID from token
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, "We couldn't find this user", 404);
    }

    // Update password (will be hashed by pre-save hook)
    user.password = password;
    await user.save(); // Model validation will check password length

    // Return sanitized user data without password hash
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    return successResponse(res, userData, "Password reset successfully", 200);
  }
);

// Change password for authenticated user
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    // Validate both passwords are provided
    if (!currentPassword || !newPassword) {
      return errorResponse(
        res,
        "Current password and new password are required",
        400
      );
    }

    // Get authenticated user from JWT payload
    const payload = req.user;
    if (!payload) {
      return errorResponse(res, "User is not authenticated", 401);
    }

    // Fetch user with password field (excluded by default in schema)
    const user = await User.findById(payload.userId).select("+password");
    if (!user) {
      return errorResponse(res, "User doesn't exist", 404);
    }

    // Verify current password matches
    const isMatched = await user.comparePassword(currentPassword);
    if (!isMatched) {
      return errorResponse(res, "Current password is incorrect", 400);
    }

    // Update to new password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save(); // Model validation will check password length

    // Return sanitized user data without password hash
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    return successResponse(res, userData, "Password changed successfully", 200);
  }
);
