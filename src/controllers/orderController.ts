/**
 * Order Controller for Glimpse E-commerce Application
 * Handles order management operations for users
 */

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { errorResponse, successResponse } from "../utils/apiResponse";
import { Order } from "../models/Order";

// Create new order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { product, quantity, shippingAddress } = req.body;

  if (!product || !quantity || !shippingAddress) {
    return errorResponse(res, "All required fields must be provided", 400);
  }

  const order = new Order({
    user: userId,
    product,
    quantity,
    shippingAddress,
  });

  await order.save();
  return successResponse(res, order, "Order created successfully", 201);
});

// Update order shipping address (User)
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const orderId = req.params.id;
  const { shippingAddress } = req.body;

  if (!orderId) return errorResponse(res, "Please provide order id", 400);

  const order = await Order.findById(orderId);
  if (!order) return errorResponse(res, "Order not found", 404);

  // Verify order belongs to user
  if (order.user.toString() !== userId?.toString()) {
    return errorResponse(res, "Unauthorized to update this order", 403);
  }

  // Users can only update shipping address
  if (shippingAddress) order.shippingAddress = shippingAddress;

  await order.save();
  return successResponse(res, order, "Order updated successfully", 200);
});

// Update order status, payment, and delivery (Admin only)
export const updateOrderAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const { status, paymentStatus, deliveryDate } = req.body;

    if (!orderId) return errorResponse(res, "Please provide order id", 400);

    const order = await Order.findById(orderId);
    if (!order) return errorResponse(res, "Order not found", 404);

    // Update only provided fields
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryDate) order.deliveryDate = deliveryDate;

    await order.save();
    return successResponse(res, order, "Order updated successfully", 200);
  }
);

// Delete order
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.id;

  if (!orderId) return errorResponse(res, "Please provide order id", 400);

  // findByIdAndDelete returns deleted document or null
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) return errorResponse(res, "Order not found", 404);

  return successResponse(res, order, "Order deleted successfully", 200);
});

// Get all orders for authenticated user with pagination
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { page = "1", limit = "20", status } = req.query;

  // Build query
  const query: any = { user: userId };

  // Status filter
  if (status && typeof status === "string") {
    query.status = status;
  }

  // Pagination
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Fetch orders
  const orders = await Order.find(query)
    .sort("-createdAt")
    .limit(limitNum)
    .skip(skip);

  // Get total count
  const total = await Order.countDocuments(query);

  return successResponse(
    res,
    {
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
    `${orders.length} orders found`,
    200
  );
});
