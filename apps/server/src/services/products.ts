import { query } from "../database/database.ts";
import { productQuerySchema } from "@workspace/schemas/products";
import type { Product, Category } from "@workspace/schemas/products";
import { NextFunction, Request, Response } from "express";

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate query parameters
    const queryValidation = productQuerySchema.safeParse(req.query);

    if (!queryValidation.success) {
      return next({
        success: false,
        error: "Invalid query parameters",
        details: queryValidation.error.issues,
      });
    }

    const { page, limit, search, category } = queryValidation.data;
    const offset = (page - 1) * limit;

    // Build WHERE conditions with parameterized queries
    let whereConditions = ["p.is_active = true"];
    let queryArgs = [];
    let argIndex = 1;

    if (search) {
      whereConditions.push(`p.name ILIKE $${argIndex}`);
      // Match any string that contains the value of the search
      queryArgs.push(`%${search}%`);
      argIndex++;
    }

    if (category) {
      whereConditions.push(`cateogry.slug = $${argIndex}`);
      queryArgs.push(category);
      argIndex++;
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    // Get products with total count
    const productsQuery = `
        SELECT 
            p.id, p.name, p. description, p.slug, p.price, p.image_url, 
            p.is_active, p.created_at, 
            c.id as category_id, c.name as category_name, c.slug as category_slug,
            COUNT(*) OVER() as total_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT $${argIndex} OFFSET $${argIndex + 1}
    `;

    queryArgs.push(limit, offset);

    const result = await query(productsQuery, queryArgs);
    const products: Product[] = result.rows;

    const total = result.rows[0]?.total_count
      ? parseInt(result.rows[0].total_count)
      : 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        total,
        page,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    next({
      success: false,
      error: "Failed to fetch products",
    });
  }
}

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate query parameters
    const result = await query("SELECT * FROM categories ORDER BY name ASC");
    const categories: Category[] = result.rows;

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next({
      success: false,
      error: "Failed to fetch categories",
    });
  }
}
