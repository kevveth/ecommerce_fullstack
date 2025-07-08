import { useState } from "react";
import { useProducts } from "./useProducts";
import { useCategories } from "../Categories/useCategories";
import { ProductQuery } from "@workspace/schemas/products";

// Styles
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Link } from "react-router";

export function Products() {
  const [filters, setFilters] = useState<ProductQuery>({
    page: 1,
    limit: 12,
    search: "",
    category: "",
  });

  const {
    data: productsData,
    isPending: isLoading,
    isError,
    error,
  } = useProducts(filters);

  const { data: categories } = useCategories();

  const updateFilters = (newFilters: Partial<ProductQuery>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when search/category changes
      page:
        newFilters.search !== undefined || newFilters.category !== undefined
          ? 1
          : prev.page,
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          Error: {error?.message || "Failed to load products"}
        </div>
      </div>
    );
  }

  const {
    products = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = productsData || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder={`Search ${filters.category || "products"} 🔎`}
          value={filters.search || ""}
          onChange={({ target }) =>
            updateFilters({ search: target.value || undefined })
          }
        />
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            updateFilters({ category: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results info */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {products.length} of {total} products
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                    loading="lazy"
                  />
                )}
              </CardHeader>
              <CardContent>
                <CardTitle>{product.name}</CardTitle>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
                {product.category && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.category.name}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => updateFilters({ page: page - 1 })}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => updateFilters({ page: page + 1 })}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
