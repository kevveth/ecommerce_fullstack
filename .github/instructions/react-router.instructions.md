<!--
Custom instructions for Copilot: React Router v7 Usage in TypeScript React Monorepos

These guidelines help Copilot generate idiomatic, maintainable, and modern routing code.
-->

# React Router v7 Copilot Coding Instructions

## Installation & Imports

- Install with `npm i react-router` (v7+).
- Import all APIs from `react-router` (not `react-router-dom`).
- For DOM-specific APIs (e.g., `RouterProvider`), import from `react-router/dom`.

## Routing Configuration

- Use `<BrowserRouter>` or `createBrowserRouter` for app routing.
- Configure routes with `<Routes>`/`<Route>` or route objects/JSX.
- Use nested routes and `<Outlet />` for layouts.
- Use layout routes (no `path`) for grouping and shared UI.
- Use index routes (`index` prop) for default child content.
- Use dynamic segments (`:param`) and splats (`*`) for flexible matching.
- For multi-segment splats, split into parent/child and update relative links (see v7 docs).

## Navigation

- Use `<Link>` and `<NavLink>` for navigation; never use `<a href>` for internal links.
- Use `useNavigate` for programmatic navigation (e.g., after form submit).
- Use `replace` option to avoid history stack bloat for search/filter UIs.
- Use `useParams` for route params, `useSearchParams` for query strings, and `useLocation` for location info.

## Data APIs

- Use loaders for data fetching and actions for mutations.
- Use `<Form>` for navigation and data mutations.
- Use `useLoaderData`, `useActionData`, `useNavigation`, and `useFetcher` for data/state.
- Use optimistic UI and `useFetcher` for mutations without navigation.
- Use suspense and lazy loading for code splitting.

## Error Handling

- Use `errorElement` for error boundaries at route level.
- Use contextual error elements for granular error handling.
- Throw responses in loaders/actions for expected errors (e.g., 404).

## v7 Upgrade Notes

- Enable all v7 future flags in v6 before upgrading.
- Update imports to `react-router` and `react-router/dom`.
- Update multi-segment splats and relative links as per v7 docs.
- Use uppercase HTTP methods for `formMethod`.
- Replace `fallbackElement` with `HydrateFallback` for SSR/partial hydration.

## Example Patterns

```typescript
import { BrowserRouter, Routes, Route, Link, Outlet, useParams, useNavigate, useSearchParams, useLocation } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/profile/1">Profile</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
```

## Resources

- [React Router Docs](https://reactrouter.com/start/declarative/installation)
- [Routing](https://reactrouter.com/start/declarative/routing)
- [Navigation](https://reactrouter.com/start/declarative/navigating)
- [URL Values](https://reactrouter.com/start/declarative/url-values)
- [Upgrading to v7](https://reactrouter.com/upgrading/v6)

<!-- End of React Router v7 custom instructions -->
