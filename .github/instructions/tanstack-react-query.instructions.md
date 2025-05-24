<!--
Custom instructions for Copilot: TanStack React Query (v5+) Usage in TypeScript React Monorepos

These guidelines help Copilot generate code that is idiomatic, type-safe, and maintainable for data fetching and caching with React Query.
-->

# TanStack React Query Copilot Coding Instructions

## General Usage

- Always import hooks from `@tanstack/react-query`.
- Use `QueryClientProvider` at the root of your app.
- Use `useQuery` for data fetching, `useMutation` for data updates.
- Prefer query keys as arrays for type safety and cache control.
- Use async/await for query/mutation functions.
- Co-locate queries with the components that use them.
- Use `select` to transform data in queries.
- Use `enabled` to control when queries run.
- Use `invalidateQueries` after mutations to keep data fresh.
- Prefer optimistic updates for fast UX.
- Use `onError` and `onSettled` for error handling and side effects.
- Use `isLoading`, `isError`, `isSuccess` for UI states.
- Use devtools in development for debugging.

## Example Patterns

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const { data, isLoading, isError } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: updateProduct,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
});
```

## Best Practices

- Use query keys consistently for cache control.
- Use suspense for loading states if desired.
- Avoid global state for server data; use React Query cache.
- Use pagination/infinite queries for large lists.
- Use `keepPreviousData` for smooth pagination.
- Use `staleTime` and `cacheTime` to tune caching.
- Use `prefetchQuery` for preloading data.
- Use error boundaries for error handling.

## Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [API Reference](https://tanstack.com/query/latest/docs/react/reference)
- [Devtools](https://tanstack.com/query/latest/docs/react/devtools)

<!-- End of TanStack React Query custom instructions -->
