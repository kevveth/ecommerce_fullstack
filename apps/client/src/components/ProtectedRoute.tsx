import { Navigate, useLocation, Outlet } from "react-router";
import { useRequireAuth } from "../hooks/useRequireAuth";

const ROUTE_STORAGE_KEY = "last-route";

interface ProtectedRouteProps {
  requiredRole?: string;
}

/**
 * ProtectedRoute ensures only authenticated users (and optionally, users with a specific role)
 * can access the wrapped route. Shows a spinner while loading, redirects to login if not authenticated.
 */
export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useRequireAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner while checking authentication
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current location to localStorage before redirecting
    if (location.pathname !== "/login") {
      localStorage.setItem(ROUTE_STORAGE_KEY, location.pathname);
    }

    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check the user's role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to unauthorized page or home page
    return <Navigate to="/" replace />;
  }

  // If authenticated and has the required role (if specified), render the children
  return <Outlet />;
};
