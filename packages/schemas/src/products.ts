import { z } from "zod";

export const categorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100).trim(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  created_at: z.coerce.date(),
});

export type Category = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200).trim(),
  description: z.string().max(5000).trim().nullable(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  price: z.coerce.number().positive().max(999999.99),
  image_url: z.string().url().max(500).nullable(),
  category_id: z.number().int().positive().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  // Make category optional to match your LEFT JOIN
  category: categorySchema.nullish(),
});

export type Product = z.infer<typeof productSchema>;

export const productQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .max(1000, { message: "Page number too high" })
    .default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().max(100).optional(),
  search: z.string().max(200).optional(),
});

export interface ProductQuery {
  page: number;
  limit: number;
  category?: string;
  search?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
