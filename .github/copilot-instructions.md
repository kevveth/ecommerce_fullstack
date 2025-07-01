# E-commerce Full-Stack Project Copilot Instructions

## Overview

This monorepo is a full-stack e-commerce app using TypeScript, React, Express.js, PostgreSQL, pnpm workspaces, and Turbo.

**Tech Stack:**

- **Client:** React 19+, Vite, Tailwind CSS v4, shadcn/ui, React Hook Form, TanStack Query
- **Server:** Express.js, PostgreSQL, Zod validation
- **Shared:** TypeScript interfaces, Zod schemas
- **Tools:** Turborepo (build), pnpm (package manager)

**File Organization:**

- Group files by feature, not type
- Use index files for clean imports: `export { Component } from './Component';`
- Use path aliases for internal modules
- Place shared types in `packages/schemas/src/`
- Place Zod schemas in `packages/schemas/src/`
- UI components are located in `packages/ui/src/components/`
- Always use workspace packages: `@workspace/ui`, `@workspace/schemas`

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

## BETTER-AUTH

- For information about better-auth, reference the documentation at: https://www.better-auth.com/llms.txt

## Backend & API

**Express.js Patterns:**

- For information about Express v5, reference the documentation at: https://expressjs.com/en/guide/migrating-5.html
- Always validate request data with Zod schemas

## React

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
- Write simple handlers inline
- Follow the Rules of Hooks: only call at top level, only from React functions
- Keep components pure and idempotent - same inputs = same outputs
- Break UI into small, focused components (single responsibility)
- Use explicit, well-typed props interfaces
- Co-locate state where used; lift up only when needed

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

## shadcn/ui Components

This project uses shadcn/ui as the primary component system. Components are located in `packages/ui/src/components/` and imported using `@workspace/ui/components/`.

**Key Principles:**

- Use existing shadcn/ui components from the workspace package
- Follow the component composition patterns with proper props and variants
- Maintain TypeScript interfaces and accessibility features
- Use the `cn()` utility for conditional styling

## Forms (React Hook Form + Zod + shadcn/ui)

Use React Hook Form with Zod validation and shadcn/ui form components for all forms in the application.

**Key Practices:**

- Use `useForm` with Zod resolver for validation
- Use shadcn/ui Form components for consistent styling and accessibility
- Handle form submission with proper error states
- Use TypeScript interfaces for form data types

## Schema Validation (Zod)

Use Zod for all data validation. Import from `zod` and use modern patterns.

**Key Principles:**

- Use `.safeParse()` for untrusted input, `.parse()` for trusted data
- Use top-level format validators: `z.email()`, `z.url()`, `z.uuid()`
- Handle errors with proper error formatting utilities
- Integrate with React Hook Form using `zodResolver`
- Use TypeScript inference with `z.infer<typeof schema>`

## Data Fetching (TanStack React Query)

Use TanStack Query for all server state management. Avoid useEffect for data fetching.

**Key Practices:**

- Use array query keys for type safety: `['products', id]`
- Use `enabled` option to control when queries run
- Use `invalidateQueries` after mutations to refresh data
- Use optimistic updates for better UX
- Handle loading and error states in UI

## Routing (React Router v7)

**Key Practices:**

- Import from `react-router` (not `react-router-dom`)
- Use nested routes and `<Outlet />` for layouts
- Use `<Link>`/`<NavLink>` for navigation, never `<a href>` for internal links
- Use loaders for data fetching, actions for mutations
- Use `errorElement` for route-level error boundaries
- For information about react router v7, reference the documentation at:
  https://reactrouter.com/start/declarative/routing,
  https://reactrouter.com/start/declarative/navigating,
  https://reactrouter.com/start/declarative/url-values

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
11. **Use shadcn/ui components** from `@workspace/ui/components/` for UI elements
12. **Follow shadcn/ui patterns** with proper form integration and composition

## Common Anti-Patterns to Avoid

- ❌ Using `any` type - use `unknown` or proper types
- ❌ Type assertions (`as Type`) - use type guards instead
- ❌ useEffect for data fetching - use TanStack Query
- ❌ useEffect for data transformation - calculate during render
- ❌ Premature memoization - React 19 compiler handles optimization
- ❌ Default exports - use named exports for consistency
- ❌ Missing error boundaries and loading states
- ❌ Creating custom UI components when shadcn/ui equivalents exist
- ❌ Using raw HTML form elements instead of shadcn/ui Form components

## Git Workflow

- **Commits:** See `.github/instructions/commits.instructions.md` for commit message standards
- **Pull Requests:** See `.github/instructions/pull-requests.instructions.md` for PR templates and best practices
