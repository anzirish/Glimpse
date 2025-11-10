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
import { isAdmin } from "../../middleware/validateRole";

const router = Router();

// Public routes
router.get("/", getProducts);

// Protected routes (Admin only)
router.post("/", validateAuth, isAdmin, addProduct);
router.put("/:id", validateAuth, isAdmin, updateProduct);
router.delete("/:id", validateAuth, isAdmin, deleteProduct);

export default router;
