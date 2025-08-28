import { Router, Request, Response, NextFunction } from "express";
import { getCategories, getProducts } from "@/services/products.ts";
import {
  productQuerySchema,
  productSchema,
  type Product,
} from "@workspace/schemas/products";

export async function getProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      data: filters,
      success,
      error,
    } = productQuerySchema.safeParse(req.query);

    if (!success) {
      res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      });
      return;
    }

    // Prevent server overload
    if (filters.page > 1000) {
      res.status(400).json({
        success: false,
        error: "Page number too high. Maximum allowed is 1000",
      });
      return;
    }

    // Call service layer for business logic & validate with zod
    const result = await getProducts(filters);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    next({
      success: false,
      error,
    });
  }
}

export async function getCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Call service layer
    const categories = await getCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next({
      success: false,
      error: error,
    });
  }
}
