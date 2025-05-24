<!--
Custom instructions for Copilot: React Usage in TypeScript Monorepos

These guidelines help Copilot generate idiomatic, maintainable, and modern React code.
-->

# React Copilot Coding Instructions

## Core Rules

- Components and Hooks must be pure: no side effects or mutations in render.
- Components and Hooks must be idempotent: always return the same output for the same inputs.
- Never mutate props, state, or hook arguments directly.
- Only call Hooks at the top level of function components or custom hooks.
- Only call Hooks from React functions (not regular JS functions or class components).
- Never call component functions directly; use them in JSX.
- Never pass around Hooks as regular values.

## Component Design

- Break UI into small, focused components (single responsibility principle).
- Use function components and hooks.
- Use explicit, well-typed props interfaces.
- Prefer composition over inheritance.
- Co-locate state where used; lift state up only when needed.
- Avoid storing derived data in state—compute it inline.
- Use controlled components for forms when you need React to manage the value.

## Hooks & State

- Use `useState` for local state, `useReducer` for complex state logic.
- Use `useEffect` for side effects; always clean up effects.
- Use `useMemo` and `useCallback` only for performance optimization, not as a default.
- Use custom hooks to extract reusable logic.
- Follow the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

## Purity & Immutability

- Do not mutate values after passing them to JSX or hooks.
- Use local mutation only for values created within the render.
- Use event handlers or effects for side effects, not in render.

## Thinking in React

- Start with a mockup and break UI into a component hierarchy.
- Build a static version first, then add interactivity.
- Find the minimal, complete representation of UI state.
- Identify where state should live (usually the closest common ancestor).
- Add inverse data flow by passing state setters as props.

## Best Practices

- Use clear, descriptive names for components and props.
- Write self-documenting code; add JSDoc for public APIs and complex logic.
- Use strict TypeScript configuration for type safety.
- Use [StrictMode](https://react.dev/reference/react/StrictMode) and [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) to catch common bugs.

## Resources

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Rules of React](https://react.dev/reference/rules)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Bulletproof React Patterns](https://github.com/alan2207/bulletproof-react)

<!-- End of React custom instructions -->
