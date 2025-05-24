<!--
Custom instructions for Copilot: Turborepo Usage and Optimization in pnpm-based TypeScript Monorepos

These guidelines help Copilot generate fast, maintainable, and idiomatic monorepo build/task code.
-->

# Turborepo Copilot Coding Instructions

## Core Principles

- Use Turborepo for orchestrating builds, tests, linting, and type checks across all workspaces.
- Prefer task pipelines and caching to minimize redundant work.
- Use pnpm workspaces for dependency management and workspace linking.

## Configuration

- All task pipelines are defined in [`turbo.json`](../../turbo.json).
- Workspaces are defined in [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml).
- Each workspace (`apps/*`, `packages/*`) should have its own `package.json` and build scripts.
- Use `"outputs"` in `turbo.json` to specify cacheable build artifacts (e.g., `dist/**`).
- Use `"dependsOn": ["^build"]` to ensure dependencies are built first.
- Use `"cache": false` for tasks like `dev` or `clean` that should never be cached.
- Use `"persistent": true` for long-running tasks (e.g., dev servers).

## Task Patterns

- Always run tasks via Turborepo:  
  `pnpm turbo run <task> [--filter=...]`
- Use `--filter` to scope tasks to specific workspaces or apps.
- Use `turbo run build` to build all packages/apps in dependency order.
- Use `turbo run test` to run all tests, leveraging caching for unchanged code.
- Use `turbo run lint` and `turbo run check-types` for code quality and type safety.

## Caching & Performance

- Outputs listed in `turbo.json` are cached locally in `.turbo/`.
- Use remote caching (e.g., Vercel Remote Cache) for CI speedup if needed.
- Add all relevant environment files (e.g., `.env`) to `globalDependencies` to invalidate cache when they change.
- Use `.turboignore` to exclude files from cache inputs (e.g., logs, temp files).

## Example turbo.json Task

```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": ["dist/**"]
  },
  "dev": {
    "dependsOn": ["^build"],
    "cache": false,
    "persistent": true
  },
  "test": {
    "dependsOn": ["^test"],
    "outputs": [],
    "cache": true,
    "env": ["NODE_ENV"]
  }
}
```

## Common Commands

- Build all:  
  `pnpm turbo run build`
- Develop client/server:  
  `pnpm turbo run dev --filter=client`  
  `pnpm turbo run dev --filter=server`
- Test all:  
  `pnpm turbo run test`
- Lint all:  
  `pnpm turbo run lint`
- Clean all:  
  `pnpm turbo run clean`

## Best Practices

- Keep build/test/lint scripts consistent across all workspaces.
- Use `dependsOn` to express true dependencies, but avoid unnecessary chaining.
- Prefer granular outputs for better cache hits.
- Use `pnpm` for all dependency installation and workspace linking.
- Document any custom task logic in the workspace `README.md`.

## Resources

- [Turborepo Docs](https://turborepo.com/docs)
- [Structuring a Repository](https://turborepo.com/docs/crafting-your-repository/structuring-a-repository)
- [Managing Dependencies](https://turborepo.com/docs/crafting-your-repository/managing-dependencies)
- [Configuring Tasks](https://turborepo.com/docs/crafting-your-repository/configuring-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [pnpm Workspaces](https://pnpm.io/workspaces)

<!-- End of Turborepo custom instructions -->
