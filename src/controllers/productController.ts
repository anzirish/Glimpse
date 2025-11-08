/**
 * Order Controller for Glimpse E-commerce Application
 * Handles product CRUD operations for admin users
 */

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/Product.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

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
  return successResponse(res, product, "Product added successfully", 201);
});

// Get all products with optional search and filters
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

  // Fetch products
  const products = await Product.find(query)
    .sort(sortBy as string)
    .limit(limitNum)
    .skip(skip)
    .select("-__v");

  // Get total count
  const total = await Product.countDocuments(query);

  return successResponse(
    res,
    {
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
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

    return successResponse(res, product, "Product deleted successfully", 200);
  }
);
