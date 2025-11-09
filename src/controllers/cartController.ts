/**
 * Cart Controller for Glimpse E-commerce Application
 * Handles shopping cart operations for users
 */

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { errorResponse, successResponse } from "../utils/apiResponse";
import { CartItem } from "../models/CartItem";

// Add product to cart or increment quantity if already exists
export const addItemToCart = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const productId = req.params.id;

    if (!productId) return errorResponse(res, "Please provide product id", 400);

    let cartItem = await CartItem.findOne({ user: userId, product: productId });

    if (cartItem) {
      // Increment quantity if product already in cart
      cartItem.quantity = cartItem.quantity + 1;
      await cartItem.save();
    } else {
      // Create new cart item with default quantity
      cartItem = new CartItem({ user: userId, product: productId });
      await cartItem.save();
    }

    return successResponse(
      res,
      cartItem,
      "Product added in cart successfully",
      201
    );
  }
);

// Update cart item quantity
export const updateCartProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const cartItemId = req.params.id;
    const quantity = req.body.quantity;

    if (!cartItemId)
      return errorResponse(res, "Please provide cart item id", 400);

    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) return errorResponse(res, "Item doesn't found in cart", 400);

    // Update quantity (model validation ensures quantity >= 1)
    cartItem.quantity = quantity;

    await cartItem.save();
    return successResponse(res, cartItem, "Cart updated successfully", 200);
  }
);

// Remove item from cart
export const deleteCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const cartItemId = req.params.id;

    if (!cartItemId)
      return errorResponse(res, "Please provide cart item id", 400);

    // findByIdAndDelete returns deleted document or null
    const cartItem = await CartItem.findByIdAndDelete(cartItemId);

    if (!cartItem) return errorResponse(res, "Item doesn't found in cart", 400);

    return successResponse(res, cartItem, "Product removed successfully", 200);
  }
);

// Get all items in user's cart with pagination
export const getCartProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { page = "1", limit = "20" } = req.query;

    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Fetch cart items
    const cartItems = await CartItem.find({ user: userId })
      .limit(limitNum)
      .skip(skip)
      .select("-__v");

    // Get total count
    const total = await CartItem.countDocuments({ user: userId });

    return successResponse(
      res,
      {
        cartItems,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      `${cartItems.length} items found in cart`,
      200
    );
  }
);
