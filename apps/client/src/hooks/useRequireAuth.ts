import { useState, useEffect } from "react";
import * as authService from "../context/authService";
import { useNavigate } from "react-router";
import { AuthUser } from "../context/AuthContext";

/**
 * Custom hook to require authentication for protected routes.
 * Fetches user data and manages loading/auth state.
 * Redirects to login if not authenticated.
 *
 * @returns { user, isAuthenticated, isLoading, error }
 */
export function useRequireAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        console.log("useRequireAuth: Attempting to refresh token...");

        // Attempt to refresh the access token using the refresh token cookie
        const refreshResponse = await authService.api.post<any>(
          "/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        // Make sure we update the token in memory
        if (refreshResponse.data?.accessToken) {
          console.log("useRequireAuth: Token refresh successful");
          authService.setAuthToken(refreshResponse.data.accessToken);

          // Add a log to show the token is in memory
          console.log(
            "useRequireAuth: Access token in memory:",
            !!authService.getAuthToken()
          );
        } else {
          console.log(
            "useRequireAuth: No access token in refresh response",
            refreshResponse.data
          );
        }

        // Log the current headers to verify Authorization is being set
        console.log(
          "useRequireAuth: Request headers will include Authorization:",
          !!authService.getAuthToken()
        );

        // Now fetch the current user (will use the new access token)
        const response = await authService.getCurrentUser("me");
        console.log("useRequireAuth: User fetch successful", response);

        if (isMounted && response.user) {
          const { user_id = 0, username, email, role } = response.user;
          setUser({ user_id, username, email, role });
        }
      } catch (error) {
        console.error("useRequireAuth error:", error);
        if (isMounted) {
          setUser(null);
          setError("You must be logged in to view this page.");
          navigate("/login");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return { user, isAuthenticated: !!user, isLoading, error };
}
