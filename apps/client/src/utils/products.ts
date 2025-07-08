import type {
  ProductsResponse,
  Product,
  Category,
  ProductQuery,
} from "@workspace/schemas/products";
import { env } from "./env";

const API_BASE_URL = env.VITE_SERVER_URL;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export async function fetchProducts({
  page,
  limit,
  category,
  search,
}: ProductQuery): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  // Only add defined parameters to prevent injection through URL manipulation
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (category) params.append("category", category.toString());
  if (search) params.append("search", search.toString());

  const response = await fetch(`${API_BASE_URL}/api/products?${params}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result: ApiResponse<ProductsResponse> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch products");
  }

  return result.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/categories`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result: ApiResponse<Category[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch categories");
  }

  return result.data;
}
