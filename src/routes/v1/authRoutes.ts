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

const router = Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes (require authentication)
router.get("/profile", validateAuth, getProfile);
router.put("/profile", validateAuth, updateProfile);
router.post("/change-password", validateAuth, changePassword);

export default router;
