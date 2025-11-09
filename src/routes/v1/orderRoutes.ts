/**
 * Order Routes for Glimpse E-commerce Application
 * Handles order management operations
 */

import { Router } from "express";
import {
  createOrder,
  updateOrder,
  updateOrderAdmin,
  deleteOrder,
  getMyOrders,
} from "../../controllers/orderController.js";
import { validateAuth } from "../../middleware/validateAuth.js";

const router = Router();

// All order routes require authentication
router.post("/", validateAuth, createOrder);
router.get("/my-orders", validateAuth, getMyOrders);
router.put("/:id", validateAuth, updateOrder);
router.delete("/:id", validateAuth, deleteOrder);

// Admin route
router.put("/admin/:id", validateAuth, updateOrderAdmin);

export default router;
