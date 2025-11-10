/**
 * Authentication Routes for Glimpse E-commerce Application
 * Handles user registration, login, and profile management
 */

import { Router } from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../../controllers/authController";
import { validateAuth } from "../../middleware/validateAuth";
import {
  authLimiter,
  signupLimiter,
  passwordResetLimiter,
} from "../../middleware/rateLimiter";

const router = Router();

// Public routes with rate limiting
router.post("/signup", signupLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);

// Protected routes (require authentication)
router.get("/profile", validateAuth, getProfile);
router.put("/profile", validateAuth, updateProfile);
router.post("/change-password", validateAuth, changePassword);

export default router;
