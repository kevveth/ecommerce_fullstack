import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/utils/products";
import type { ProductQuery } from "@workspace/schemas/products";

export function useProducts(options: ProductQuery) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: () => fetchProducts(options),
    // Keep previous data while loading new page/filters
    placeholderData: (previousData) => previousData,
  });
}
