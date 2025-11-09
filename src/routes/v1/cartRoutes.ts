/**
 * Cart Routes for Glimpse E-commerce Application
 * Handles shopping cart operations
 */

import { Router } from "express";
import {
  addItemToCart,
  updateCartProduct,
  deleteCartItem,
  getCartProducts,
} from "../../controllers/cartController.js";
import { validateAuth } from "../../middleware/validateAuth.js";

const router = Router();

// All cart routes require authentication
router.post("/:id", validateAuth, addItemToCart);
router.get("/", validateAuth, getCartProducts);
router.put("/:id", validateAuth, updateCartProduct);
router.delete("/:id", validateAuth, deleteCartItem);

export default router;
