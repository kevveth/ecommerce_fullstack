import { useLocation } from "react-router";
import { useAuth, AuthUser } from "../context/AuthContext";

interface UseRequireAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  shouldRedirect: boolean;
  redirectPath: string | null;
}

/**
 * Custom hook to require authentication and optionally a specific role for protected routes.
 * Returns information about authentication status and whether a redirect is needed.
 * This version is refactored to be more declarative and avoid useEffect.
 *
 * @param requiredRole Optional role required to access the route.
 * @returns An object containing authentication status and redirect information.
 */
export function useRequireAuth(
  requiredRole?: AuthUser["role"]
): UseRequireAuthReturn {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // If still loading authentication state, don't redirect yet.
  if (isLoading) {
    return {
      user,
      isAuthenticated,
      isLoading,
      shouldRedirect: false,
      redirectPath: null,
    };
  }

  // If not authenticated, prepare redirect to login.
  if (!isAuthenticated) {
    return {
      user,
      isAuthenticated,
      isLoading,
      shouldRedirect: true,
      redirectPath: `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
    };
  }

  // If authenticated but does not have the required role, prepare redirect to home (or an unauthorized page).
  if (requiredRole && user?.role !== requiredRole) {
    return {
      user,
      isAuthenticated,
      isLoading,
      shouldRedirect: true,
      redirectPath: "/", // Or a specific unauthorized page e.g., /unauthorized
    };
  }

  // If authenticated and (no role required OR has the required role), no redirect is needed.
  return {
    user,
    isAuthenticated,
    isLoading,
    shouldRedirect: false,
    redirectPath: null,
  };
}
