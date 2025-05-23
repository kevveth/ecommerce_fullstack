import { Navigate, useLocation, Outlet } from "react-router";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { Suspense } from "react";
import { AuthUser } from "../context/AuthContext"; // Import AuthUser

interface ProtectedRouteProps {
  requiredRole?: AuthUser["role"]; // Use AuthUser['role'] for type safety
  /**
   * Custom loading component to show while checking authentication
   */
  loadingComponent?: React.ReactNode;
}

/**
 * ProtectedRoute ensures only authenticated users (and optionally, users with a specific role)
 * can access the wrapped route. Uses TanStack Query via useRequireAuth for auth state management.
 */
export const ProtectedRoute = ({
  requiredRole,
  loadingComponent = <div className="auth-loading">Verifying access...</div>,
}: ProtectedRouteProps) => {
  // useRequireAuth now returns an object with redirectPath and shouldRedirect
  // Removed unused isAuthenticated from destructuring
  const { isLoading, user, redirectPath, shouldRedirect } =
    useRequireAuth(requiredRole);
  const location = useLocation();

  // Show customizable loading state while authentication is being checked
  if (isLoading) {
    return (
      <Suspense fallback={loadingComponent}>
        <div className="auth-check-container">{loadingComponent}</div>
      </Suspense>
    );
  }

  // If useRequireAuth determined a redirect is needed
  if (shouldRedirect && redirectPath) {
    return (
      <Navigate
        to={redirectPath}
        state={{
          from: location,
          message:
            requiredRole && user && user.role !== requiredRole
              ? "You do not have the necessary permissions to view this page."
              : "You must be logged in to access this page.",
        }}
        replace
      />
    );
  }

  // If not loading and no redirect is needed (all checks passed in useRequireAuth), render the child routes
  return <Outlet />;
};
