# E-commerce Full-Stack Project Copilot Instructions

## Overview

This monorepo is a full-stack e-commerce app using TypeScript, React, Express.js, PostgreSQL, pnpm workspaces, and Turbo.

**Tech Stack:**

- **Client:** React 18+, Vite, CSS Modules, React Hook Form, TanStack Query
- **Server:** Express.js, PostgreSQL, Zod validation
- **Shared:** TypeScript interfaces, Zod schemas
- **Tools:** Vitest (testing), Turborepo (build), pnpm (package manager)

**File Organization:**

- Group files by feature, not type
- Use index files for clean imports: `export { Component } from './Component';`
- Use path aliases for internal modules
- Place shared types in `packages/shared/src/types/`
- Place Zod schemas in `packages/shared/src/schemas/`

## General Coding Standards

**TypeScript Core Principles:**

- Use strict TypeScript configuration
- **Always prefer `interface` over `type`** unless `type` is specifically needed for unions, primitives, or computed types
- Use type guards, never type assertions (`x as Type`)
- Use primitive types (`string`, `number`, `boolean`) not wrapper types (`String`, `Number`, `Boolean`)
- Avoid `any` - use `unknown` for truly unknown types, `void` for ignored callback returns
- Use utility types (`Partial<T>`, `Pick<T, K>`) and generics with constraints (`<T extends ...>`)
- Use `as const` for literals and readonly arrays

**Code Style:**

- Use `const`/`let`, never `var`. Prefer `const` by default
- Use `===`/`!==` instead of `==`/`!=` (except `== null` checks)
- Use named exports, avoid default exports for consistency
- Use arrow functions for expressions, function declarations for named functions
- Use `for...of` for arrays, avoid `forEach` (breaks compiler checks)
- Use semicolons explicitly, don't rely on ASI
- Write self-documenting code with clear naming and JSDoc for public APIs

**Standard Patterns:**

```typescript
// ✅ Interface for object shapes
interface User {
  id: string;
  name: string;
  email?: string;
}

// ✅ Type for unions/primitives
type Status = "pending" | "approved" | "rejected";

// ✅ Type guards
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}

// ✅ Utility types
type PartialUser = Partial<User>;
type UserEmail = Pick<User, "email">;
```

## Backend & API

**Express.js Patterns:**

- Use async/await for all async operations
- Use middleware for cross-cutting concerns (auth, validation, error handling)
- Use parameterized queries for database access
- Use transactions for multi-step operations
- Always validate request data with Zod schemas

**Standard API Route:**

```typescript
app.post("/api/users", async (req, res, next) => {
  try {
    const userData = CreateUserSchema.parse(req.body);
    const user = await createUser(userData);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

## React Development

**Component Structure:**

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Component logic here
}
```

**Core Principles:**

- Use function components and hooks exclusively
- Follow the Rules of Hooks: only call at top level, only from React functions
- Keep components pure and idempotent - same inputs = same outputs
- Break UI into small, focused components (single responsibility)
- Use explicit, well-typed props interfaces
- Co-locate state where used; lift up only when needed
- Use `useState` for local state, `useReducer` for complex state logic

### Effects and State Management

- **Avoid unnecessary Effects:** Don't use Effects to transform data for rendering - calculate during render instead
- **Don't derive state in Effects:** Calculate values from existing props/state during rendering
- **Reset state with `key` prop:** Use different `key` values to reset component state instead of Effects
- **Handle user events in event handlers:** Effects are for component display synchronization, not user interactions
- **Use Effects only for external synchronization:** Browser APIs, third-party libraries, etc.
- **Always implement cleanup:** Use cleanup functions to prevent race conditions and memory leaks

### Memoization (React 19+)

- **React Compiler handles optimization automatically:** Write simple, clean code first - React 19's compiler optimizes performance automatically
- **Avoid premature memoization:** Don't use `useMemo`/`useCallback` by default - they add complexity without guaranteed benefits
- **Use `useMemo` only when necessary:** For extremely expensive calculations that React's automatic optimizations don't catch
- **Use `useCallback` sparingly:** Only when passing functions to `React.memo` components that depend on strict reference equality
- **Test performance before optimizing:** Measure actual performance impact before adding manual memoization

### Data Fetching with TanStack Query

**Use TanStack Query for all server state management - avoid useEffect for data fetching.**

**Standard Query Pattern:**

```typescript
const { data: products, isLoading, isError, error } = useQuery({
  queryKey: ['products', categoryId],
  queryFn: () => fetchProducts(categoryId),
  enabled: !!categoryId,
});

if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error: {error.message}</div>;
```

**Mutation Pattern:**

```typescript
const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  },
  onError: (error) => {
    // Handle error
  },
});
```

## Forms (React Hook Form + Zod)

**Standard Form Pattern:**

```typescript
const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <span aria-live="polite">{form.formState.errors.email.message}</span>
      )}
    </form>
  );
}
```

**Key Practices:**

- Use `useForm` with Zod resolver for validation
- Prefer uncontrolled components for better performance
- Use `Controller` for third-party UI components
- Handle errors with proper accessibility attributes
- Use `useFieldArray` for dynamic form sections

## Schema Validation (Zod)

**Import:** `import { z } from "zod/v4"` (stable v4 API from Zod ^3.25)

**Modern Zod v4 Patterns:**

```typescript
// ✅ Use top-level format validators
const UserSchema = z.object({
  id: z.string(),
  email: z.email(), // Not z.string().email()
  url: z.url().optional(), // Not z.string().url()
  uuid: z.uuid(), // Not z.string().uuid()
});

// ✅ Error customization with unified 'error' parameter
const PasswordSchema = z.string().min(8, {
  error: "Password must be at least 8 characters",
});

// ✅ Use z.strictObject() and z.looseObject()
const StrictUser = z.strictObject({
  name: z.string(),
  email: z.email(),
});

// ✅ Record with proper key/value specification
const StringRecord = z.record(z.string(), z.number());
```

**Error Handling & Formatting:**

```typescript
// ✅ Basic error handling with safeParse
const result = UserSchema.safeParse(data);
if (!result.success) {
  // Access raw error issues
  console.log(result.error.issues);
}

// ✅ Nested error structure with z.treeifyError (most useful)
const result = UserSchema.safeParse(data);
if (!result.success) {
  const errorTree = z.treeifyError(result.error);

  // Access specific field errors with optional chaining
  const usernameErrors = errorTree.properties?.username?.errors;
  const favoriteNumbersErrors =
    errorTree.properties?.favoriteNumbers?.items?.[1]?.errors;

  // Use in UI components
  if (errorTree.properties?.email?.errors) {
    displayEmailError(errorTree.properties.email.errors[0]);
  }
}

// ✅ Flat error structure with z.flattenError (for simple forms)
const result = UserSchema.safeParse(data);
if (!result.success) {
  const flattened = z.flattenError(result.error);

  // { formErrors: string[], fieldErrors: { [key: string]: string[] } }
  const emailErrors = flattened.fieldErrors.email; // string[]
  const topLevelErrors = flattened.formErrors; // string[]
}

// ✅ Human-readable string with z.prettifyError
const result = UserSchema.safeParse(data);
if (!result.success) {
  const prettyError = z.prettifyError(result.error);
  console.log(prettyError); // "✖ Invalid input: expected string, received number → at username"
}
```

**Form Integration Patterns:**

```typescript
// ✅ React Hook Form integration with proper error handling
function UserForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Manual validation with detailed error handling
  const handleManualValidation = (data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errorTree = z.treeifyError(result.error);

      // Set form errors for specific fields
      Object.entries(errorTree.properties || {}).forEach(
        ([field, fieldError]) => {
          if (fieldError?.errors?.[0]) {
            form.setError(field as keyof FormData, {
              message: fieldError.errors[0],
            });
          }
        }
      );
    }
  };
}

// ✅ API error handling
app.post("/api/users", async (req, res, next) => {
  try {
    const userData = CreateUserSchema.parse(req.body);
    const user = await createUser(userData);
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorTree = z.treeifyError(error);
      return res.status(400).json({
        message: "Validation failed",
        errors: errorTree,
      });
    }
    next(error);
  }
});
```

**Key Practices:**

- Use `.safeParse()` for untrusted input, `.parse()` for trusted data
- Use `z.treeifyError()` for complex nested error handling
- Use `z.flattenError()` for simple flat forms (single level deep)
- Use `z.prettifyError()` for console logging and debugging
- Always use optional chaining (`?.`) when accessing nested error properties
- Use `.refine()` for custom validation logic
- Compose schemas with `.extend()`, `.merge()`, `.pick()`, `.omit()`
- Use top-level format validators: `z.email()`, `z.url()`, `z.uuid()`
- Use `error` parameter instead of deprecated message parameters

## Data Fetching (TanStack React Query)

**Setup:**

```typescript
// App root
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

**Query Patterns:**

```typescript
// Basic query
const { data, isLoading, isError } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

// Dependent query
const { data: product } = useQuery({
  queryKey: ["product", productId],
  queryFn: () => fetchProduct(productId),
  enabled: !!productId,
});

// Transform data
const { data: productNames } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  select: (data) => data.map((p) => p.name),
});
```

**Key Practices:**

- Use array query keys for type safety: `['products', id]`
- Use `enabled` option to control when queries run
- Use `invalidateQueries` after mutations to refresh data
- Use optimistic updates for better UX
- Handle loading and error states in UI

## Routing (React Router v7)

**Basic Setup:**

```typescript
import { BrowserRouter, Routes, Route, Link } from 'react-router';

// Navigation
<Link to="/products">Products</Link>

// Route params
const { productId } = useParams();
const [searchParams] = useSearchParams();

// Programmatic navigation
const navigate = useNavigate();
navigate('/products');
```

**Key Practices:**

- Import from `react-router` (not `react-router-dom`)
- Use nested routes and `<Outlet />` for layouts
- Use `<Link>`/`<NavLink>` for navigation, never `<a href>` for internal links
- Use loaders for data fetching, actions for mutations
- Use `errorElement` for route-level error boundaries

## Monorepo Build (Turborepo)

**Common Commands:**

```bash
# Development
pnpm turbo run dev

# Build all packages
pnpm turbo run build

# Filter to specific workspace
pnpm turbo run build --filter=@ecommerce/client

# Test with cache
pnpm turbo run test
```

**Key Practices:**

- Use `"dependsOn": ["^build"]` to ensure deps are built first
- Specify `"outputs"` for cacheable build artifacts
- Use `"cache": false` for dev servers
- Use `"persistent": true` for long-running tasks

## Code Generation Guidelines

When generating code, always:

1. **Use TypeScript interfaces** for object shapes, types for unions
2. **Include proper error handling** with try/catch and Zod validation
3. **Use TanStack Query** for all server state management
4. **Follow naming conventions** (camelCase for variables/functions, PascalCase for components/types)
5. **Add proper loading/error states** for async operations
6. **Include accessibility attributes** (aria-live, proper form labels)
7. **Use semantic HTML** with proper structure
8. **Implement cleanup** in useEffect hooks when needed
9. **Add JSDoc comments** for complex logic and public APIs
10. **Use modern Zod v4 patterns** with top-level validators

## Common Anti-Patterns to Avoid

- ❌ Using `any` type
- ❌ Type assertions instead of type guards
- ❌ useEffect for data fetching (use TanStack Query)
- ❌ useEffect for data transformation
- ❌ Premature memoization with useMemo/useCallback
- ❌ Mutating props or state directly
- ❌ Default exports
- ❌ forEach for array iteration
- ❌ Missing error boundaries
- ❌ Unhandled promise rejections
- ❌ Missing loading states
- ❌ Deprecated Zod v3 patterns (z.string().email(), .format(), etc.)

## Git Workflow

- **Commits:** See `.github/instructions/commits.instructions.md` for commit message standards
- **Pull Requests:** See `.github/instructions/pull-requests.instructions.md` for PR templates and best practices
