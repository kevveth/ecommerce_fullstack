---
description: "TanStack Query (React Query) data fetching and server state management"
applyTo: "apps/client/**/*.ts, apps/client/**/*.tsx"
---

# TanStack Query Development Guidelines

## Architecture

### Setup Configuration

- Version: `@tanstack/react-query` v5.81.2
- Client setup in `apps/client/src/main.tsx`
- Basic QueryClient with default configuration
- Provider wraps entire application

### Integration Patterns

- Custom hooks pattern for auth operations (`useSignUp`, `useSignIn`)
- Direct component usage for data fetching (`Profiles.tsx`)
- No global query cache invalidation patterns detected
- Simple error handling with component-level error states

## CLI Commands

```bash
# Add TanStack Query to client
pnpm add @tanstack/react-query --filter=@ecommerce/client
```

## Configuration

### QueryClient Setup

```typescript
// apps/client/src/main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Wrap app with provider
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### Current Settings

- No custom QueryClient configuration
- Default retry: 3 attempts
- Background refetching enabled

## Development Rules

### Query Patterns

```typescript
// Standard query with destructured return
const {
  data: users,
  isError,
  isPending,
} = useQuery({
  queryKey: ["users"],
  queryFn: async () => {
    const response = await fetch("http://localhost:3000/api/users/");
    return (await response.json()) as Users;
  },
  retry: 1,
});
```

### Mutation Patterns

```typescript
// Auth mutation with navigation side effect
const {
  mutate: signUpWithEmail,
  isPending,
  error,
  isError,
} = useMutation({
  mutationKey: ["sign-up"],
  mutationFn: async (data: SignUpInput) => {
    const { data: response, error } = await authClient.signUp.email(data);
    if (error) throw error;
    return response;
  },
  onError: (error) => console.error("Sign up error:", error),
  onSuccess: () => navigate("/"),
});
```

### Query Keys

- Array format: `["users"]`, `["sign-up"]`, `["sign-in"]`
- No nested keys in current codebase

### Error Handling

```typescript
// Component-level error handling
{isPending && <p>Loading...</p>}
{isError && <p>Error fetching users</p>}
{users ? (
  // Render data
) : (
  <p>No users found</p>
)}
```

### TypeScript Integration

```typescript
// Type API responses
interface Users {
  data: User[];
}

return (await response.json()) as Users;
```

### Custom Hook Patterns

```typescript
// Standard export pattern from codebase
export function useSignUp() {
  const {
    mutate: signUpWithEmail,
    isPending,
    error,
    isError,
  } = useMutation({
    // ...existing code...
  });

  return { data, error, isError, isPending, signUpWithEmail };
}
```

## AI Agent Guidelines

### Required Patterns

- Use TanStack Query for all server state (never `useEffect`)
- Handle `isPending`, `isError` states in components
- Use array-based query keys: `["users"]`, `["profile", userId]`
- Export custom hook states: `{ isPending, error, isError, mutate }`

### Auth Integration

- Follow better-auth patterns in existing hooks
- Use `onSuccess` for navigation after mutations
- Log errors with `onError` callbacks
