import { z } from "zod";

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  image_url: string | null;
  category_id: number | null;
  is_active: boolean;
  created_at: Date;
  category?: Category;
}

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
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
