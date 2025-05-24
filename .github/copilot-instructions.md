# E-commerce Full-Stack Project Copilot Instructions

> For all technology-specific patterns (React, Zod, React Router, TanStack React Query, etc.), see the dedicated instruction files in `.github/instructions/`.

## Overview

This monorepo is a full-stack e-commerce app using TypeScript, React, Express.js, PostgreSQL, pnpm workspaces, and Turbo.

- **Client:** React 18+, Vite, CSS Modules
- **Server:** Express.js, PostgreSQL
- **Shared:** Common types/schemas (see Zod instructions)
- **Testing:** Vitest
- **Build:** Turbo

## General Coding Standards

- Use strict TypeScript configuration.
- Prefer `interface` for extensible object shapes; use `type` for unions/primitives.
- Use type guards, not type assertions.
- Use utility types (`Partial<T>`, `Pick<T, K>`, etc.) and custom types for domain logic.
- Use `as const` for literals and readonly arrays.
- Use generics with constraints (`<T extends ...>`).
- Write self-documenting code with clear naming and JSDoc for public APIs.
- Group files by feature, not type. Use index files for clean imports.
- Use path aliases for internal modules.
- Prioritize code readability, type safety, and user experience.

## Backend & API

- Use async/await for all async code.
- Use middleware for cross-cutting concerns (auth, validation, error handling).
- Use parameterized queries for DB access.
- Use transactions for multi-step DB operations.
- Handle database errors gracefully.

## Testing

- Test user behavior, not implementation details.
- Use user-centric queries in tests.
- Mock external dependencies.
- Test API endpoints for all scenarios.

## Topic-Specific Instructions

- **React:** See `.github/instructions/react.instructions.md` for React component, hooks, and UI best practices.
- **Zod:** See `.github/instructions/zod.instructions.md` for schema, validation, and type inference best practices.
- **React Router:** See `.github/instructions/react-router.instructions.md` for routing, navigation, and data loading patterns.
- **TanStack React Query:** See `.github/instructions/tanstack-react-query.instructions.md` for data fetching, caching, and mutation patterns.
- **Turborepo:** See `.github/instructions/turbo.instructions.md` for monorepo build and task orchestration patterns.
- **Git Workflow:**
  - See `.github/instructions/commits.instructions.md` for commit message standards and conventions.
  - See `.github/instructions/pull-requests.instructions.md` for PR templates and best practices.

## Documentation

- Use clear, descriptive names.
- Add JSDoc for public APIs and complex logic.
- Prefer self-documenting code.

---

**For all technology-specific patterns, always refer to the dedicated instruction files in `.github/instructions/`.**
