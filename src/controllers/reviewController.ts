/**
 * Review Controller for Glimpse E-commerce Application
 * Handles product review and rating operations
 */

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { errorResponse, successResponse } from "../utils/apiResponse";
import { Review } from "../models/Review";
import { Order } from "../models/Order";

// Create review for purchased product (User only)
export const createRating = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { product, rating, comment } = req.body;

    if (!product || !rating || !comment) {
      return errorResponse(res, "All required fields must be provided", 400);
    }

    // Verify user has purchased this product
    const hasPurchased = await Order.findOne({
      user: userId,
      product: product,
      status: "delivered",
    });

    if (!hasPurchased) {
      return errorResponse(
        res,
        "You can only review products you have purchased",
        403
      );
    }

    const review = new Review({
      user: userId,
      product,
      rating,
      comment,
    });

    await review.save();
    return successResponse(res, review, "Review created successfully", 201);
  }
);

// Update existing review (User only)
export const updateRating = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    if (!reviewId) return errorResponse(res, "Please provide review id", 400);

    const review = await Review.findById(reviewId);
    if (!review) return errorResponse(res, "Review not found", 404);

    // Verify review belongs to user
    if (review.user.toString() !== userId?.toString()) {
      return errorResponse(res, "Unauthorized to update this review", 403);
    }

    // Update only provided fields
    if (rating !== undefined) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    return successResponse(res, review, "Review updated successfully", 200);
  }
);

// Get all reviews for a product with pagination
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const { page = "1", limit = "20" } = req.query;

  if (!productId) return errorResponse(res, "Please provide product id", 400);

  // Pagination
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Fetch reviews
  const reviews = await Review.find({ product: productId })
    .sort("-createdAt")
    .limit(limitNum)
    .skip(skip)
    .populate("user", "name email");

  // Get total count
  const total = await Review.countDocuments({ product: productId });

  return successResponse(
    res,
    {
      reviews,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
    `${reviews.length} reviews found`,
    200
  );
});

// Delete review (User only)
export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const reviewId = req.params.id;

    if (!reviewId) return errorResponse(res, "Please provide review id", 400);

    const review = await Review.findById(reviewId);
    if (!review) return errorResponse(res, "Review not found", 404);

    // Verify review belongs to user
    if (review.user.toString() !== userId?.toString()) {
      return errorResponse(res, "Unauthorized to delete this review", 403);
    }

    await Review.findByIdAndDelete(reviewId);
    return successResponse(res, review, "Review deleted successfully", 200);
  }
);
