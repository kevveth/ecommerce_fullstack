import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

/**
 * Custom hook to require authentication for protected routes.
 * Redirects to login if the user is not authenticated.
 *
 * @returns The authentication context
 */
export function useRequireAuth() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until loading is complete before checking auth state
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Save current path for redirecting back after login
      const currentPath = window.location.pathname;

      navigate("/login", {
        state: {
          redirectPath: currentPath,
          message: "You must be logged in to access this page.",
        },
      });
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  return auth;
}
