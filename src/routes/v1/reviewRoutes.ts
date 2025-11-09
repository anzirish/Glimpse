/**
 * Review Routes for Glimpse E-commerce Application
 * Handles product review and rating operations
 */

import { Router } from "express";
import {
  createRating,
  updateRating,
  getReviews,
  deleteReview,
} from "../../controllers/reviewController.js";
import { validateAuth } from "../../middleware/validateAuth.js";

const router = Router();

// Public route
router.get("/product/:productId", getReviews);

// Protected routes (require authentication)
router.post("/", validateAuth, createRating);
router.put("/:id", validateAuth, updateRating);
router.delete("/:id", validateAuth, deleteReview);

export default router;
