import { query } from "../database/database.ts";
import { categorySchema, productSchema } from "@workspace/schemas/products";
import type {
  Product,
  Category,
  ProductQuery,
} from "@workspace/schemas/products";

export async function getProducts(filters: ProductQuery) {
  const { page, limit, search, category } = filters;
  const offset = (page - 1) * limit;

  let whereConditions = ["p.is_active = true"];
  let queryArgs: unknown[] = [];
  let argIndex = 1;

  if (search) {
    whereConditions.push(`p.name ILIKE $${argIndex}`);
    queryArgs.push(`%${search}%`); // Using parameterized query to prevent SQL injection
    argIndex++;
  }

  if (category) {
    whereConditions.push(`c.slug = $${argIndex}`);
    queryArgs.push(category); // Zod already validated format with regex to prevent injection
    argIndex++;
  }

  const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

  // Security: Using parameterized query to prevent SQL injection
  const productsQuery = `
    SELECT 
      p.id, p.name, p.description, p.slug, p.price, p.image_url, 
      p.category_id,
      p.is_active, p.created_at, p.updated_at,
      c.id as category_join_id, c.name as category_name, c.slug as category_slug, c.created_at as category_created_at,
      COUNT(*) OVER() as total_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT $${argIndex} OFFSET $${argIndex + 1}
  `;

  queryArgs.push(limit, offset);

  const result = await query(productsQuery, queryArgs);

  const products: Product[] = result.rows.map((row) => {
    const category =
      row.category_join_id != null
        ? {
            id: row.category_join_id,
            name: row.category_name,
            slug: row.category_slug,
            created_at: row.category_created_at,
          }
        : null;

    return productSchema.parse({ ...row, category });
  });

  const total = result.rows[0]?.total_count
    ? parseInt(result.rows[0].total_count.toString(), 10)
    : 0;
  const totalPages = Math.ceil(total / limit);

  return {
    products,
    total,
    page,
    totalPages,
  };
}

export async function getCategories() {
  const result = await query(
    "SELECT id, name, slug, created_at FROM categories ORDER BY name ASC"
  );

  const categories: Category[] = categorySchema.array().parse(result.rows);

  return categories;
}
