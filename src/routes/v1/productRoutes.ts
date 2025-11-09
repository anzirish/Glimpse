/**
 * Product Routes for Glimpse E-commerce Application
 * Handles product CRUD operations
 */

import { Router } from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../controllers/productController";
import { validateAuth } from "../../middleware/validateAuth";

const router = Router();

// Public routes
router.get("/", getProducts);

// Protected routes (Admin only)
router.post("/", validateAuth, addProduct);
router.put("/:id", validateAuth, updateProduct);
router.delete("/:id", validateAuth, deleteProduct);

export default router;
