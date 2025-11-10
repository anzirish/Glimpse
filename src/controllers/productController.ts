/**
 * Order Controller for Glimpse E-commerce Application
 * Handles product CRUD operations for admin users
 */

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Product } from "../models/Product";
import { errorResponse, successResponse } from "../utils/apiResponse";
import {
  getCache,
  setCache,
  deleteCachePattern,
  CACHE_TTL,
} from "../utils/cache";

// Add new product to catalog (Admin only)
export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const { category, name, price, image, description, stock } = req.body;

  if (!category || !name || !price || !image || !description) {
    return errorResponse(res, "All required fields must be provided", 400);
  }

  const product = new Product({
    category,
    name,
    price,
    image,
    description,
    stock,
  });

  await product.save();

  // Invalidate product list cache when new product is added
  await deleteCachePattern("products:*");

  return successResponse(res, product, "Product added successfully", 201);
});

// Get all products with optional search and filters (with caching)
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    rating,
    sortBy = "-createdAt",
    page = "1",
    limit = "20",
  } = req.query;

  // Create cache key based on query parameters
  const cacheKey = `products:${JSON.stringify(req.query)}`;

  // Try to get from cache first
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return successResponse(
      res,
      cachedData,
      `${cachedData.products.length} products found (cached)`,
      200
    );
  }

  // Build query with all filters
  const query: any = {};

  // Text search (optional)
  if (keyword && typeof keyword === "string") {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  // Category filter (optional)
  if (category && typeof category === "string") {
    query.category = category.toLowerCase();
  }

  // Price range filter (optional)
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Rating filter (optional)
  if (rating) {
    query.ratingsCount = { $gte: Number(rating) };
  }

  // Pagination
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Fetch products from database
  const products = await Product.find(query)
    .sort(sortBy as string)
    .limit(limitNum)
    .skip(skip)
    .select("-__v");

  // Get total count
  const total = await Product.countDocuments(query);

  const responseData = {
    products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };

  // Cache the result for 5 minutes
  await setCache(cacheKey, responseData, CACHE_TTL.MEDIUM);

  return successResponse(
    res,
    responseData,
    `${products.length} products found`,
    200
  );
});

// Update existing product (Admin only)
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const { category, name, price, image, description, stock } = req.body;

    if (!productId) return errorResponse(res, "Please provide product id", 400);

    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, "Product not found", 404);

    // Update only provided fields
    if (category) product.category = category;
    if (name) product.name = name;
    if (image) product.image = image;
    if (description) product.description = description;
    // Check !== undefined for numbers to allow 0 as valid value (free item or out of stock)
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    await product.save();

    // Invalidate product list cache when product is updated
    await deleteCachePattern("products:*");

    return successResponse(res, product, "Product updated successfully", 200);
  }
);

// Remove product from catalog (Admin only)
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;

    if (!productId) return errorResponse(res, "Please provide product id", 400);

    // findByIdAndDelete returns deleted document or null (single query optimization)
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return errorResponse(res, "Product not found", 404);

    // Invalidate product list cache when product is deleted
    await deleteCachePattern("products:*");

    return successResponse(res, product, "Product deleted successfully", 200);
  }
);
