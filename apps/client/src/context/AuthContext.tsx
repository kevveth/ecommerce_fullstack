/**
 * AuthContext provides authentication state and actions to the application.
 * Enhanced with TanStack Query for improved data fetching and state management.
 */
import { createContext, useContext, useState, ReactNode, useMemo } from "react"; // Added ReactNode, useMemo, useState, useContext, createContext
import { useNavigate } from "react-router"; // Added useNavigate
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "./authService";
import type { User as SharedUser, LoginInput } from "@ecommerce/shared";
import axios, { AxiosError } from "axios"; // Added AxiosError import

/**
 * Represents the authenticated user, mapping from SharedUser.
 */
export interface AuthUser
  extends Omit<
    SharedUser,
    | "password_hash"
    | "google_id"
    | "street_address"
    | "city"
    | "state"
    | "zip_code"
    | "country"
  > {
  // We generally don't need password_hash or google_id on the client for AuthUser
  // Address fields can be added if specifically needed for display in auth-related contexts
}

/**
 * Defines the shape of the authentication context.
 */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Combined loading state
  loginError: string | null; // Specific error for login
  logoutError: string | null; // Specific error for logout
  userFetchError: string | null; // Specific error for user fetching
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  handleAuthCallback: (token: string) => Promise<void>; // Added for OAuth callback
  clearLoginError: () => void;
  clearLogoutError: () => void;
  clearUserFetchError: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Custom hook to access the AuthContext.
 * @returns The authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Props for the AuthProvider component.
 */
interface AuthProviderProps {
  children: ReactNode;
}

export const authUserQueryKey = ["auth", "user"];

/**
 * AuthProvider component that manages authentication state using TanStack Query.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  // userFetchError is derived from userQuery.error
  const [callbackError, setCallbackError] = useState<string | null>(null); // Added for callback errors

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearLoginError = () => setLoginError(null);
  const clearLogoutError = () => setLogoutError(null);
  const clearCallbackError = () => setCallbackError(null); // Added
  const clearUserFetchError = () =>
    queryClient.resetQueries({ queryKey: authUserQueryKey });

  const userQuery = useQuery<AuthUser | null, Error>({
    queryKey: authUserQueryKey,
    queryFn: async () => {
      const memoryToken = authService.getAuthToken();
      const cookieExists = document.cookie.includes("jwt"); // Ensure this matches your cookie name

      if (!memoryToken && !cookieExists) {
        return null;
      }

      try {
        console.log(
          "[AuthContext] Attempting to fetch authenticated user profile..."
        );
        const { user: sharedUser } =
          await authService.getAuthenticatedUserProfile();
        const authUser: AuthUser = {
          user_id: sharedUser.user_id,
          username: sharedUser.username,
          email: sharedUser.email,
          role: sharedUser.role,
        };
        console.log(
          "[AuthContext] User profile fetched successfully:",
          authUser
        );
        return authUser;
      } catch (err) {
        console.error("[AuthContext] Error fetching user profile:", err);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (reduced from 24h as staleTime is shorter)
    refetchOnWindowFocus: true, // Re-check auth status on window focus
    refetchOnMount: true, // Ensure it refetches when AuthProvider mounts if stale
    retry: (failureCount, error) => {
      if (error && typeof error === "object") {
        const axiosError = error as AxiosError;
        if (axiosError.isAxiosError && axiosError.response) {
          if (
            axiosError.response.status === 401 ||
            axiosError.response.status === 403
          ) {
            console.log(
              `[AuthContext] User query: Not retrying due to ${axiosError.response.status}`
            );
            return false; // Do not retry on 401 (Unauthorized) or 403 (Forbidden)
          }
        }
      }
      return failureCount < 2; // Retry other errors up to 2 times
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // data is AuthResponse from authService.login
      if (data.user && data.accessToken) {
        // authService.login already sets the token.
        // Transform SharedUser to AuthUser for the query cache
        const authUser: AuthUser = {
          user_id: data.user.user_id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
        };
        queryClient.setQueryData(authUserQueryKey, authUser);
        setLoginError(null);
        console.log("[AuthContext] Login successful, navigating to home.");
        navigate("/");
      } else {
        // This case should ideally be caught by authService.login's validation
        console.error(
          "[AuthContext] Login successful but user data or token missing in response."
        );
        setLoginError("Login failed: Incomplete data from server.");
        authService.removeAuthToken(); // Ensure token is cleared
        queryClient.setQueryData(authUserQueryKey, null);
      }
    },
    onError: (err: Error) => {
      console.error("[AuthContext] Login mutation error RAW:", err); // Log the raw error
      console.error("[AuthContext] Login mutation error NAME:", err.name);
      console.error("[AuthContext] Login mutation error MESSAGE:", err.message);
      console.error("[AuthContext] Login mutation error STACK:", err.stack);
      setLoginError(
        err.message || "Login failed. Please check your credentials."
      );
      // authService.login already calls removeAuthToken on error.
      queryClient.setQueryData(authUserQueryKey, null);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // authService.logout handles token removal.
      queryClient.setQueryData(authUserQueryKey, null);
      // Optionally, clear other persisted queries or redirect.
      // queryClient.clear(); // Clears all queries, might be too aggressive.
      // Consider more targeted invalidations if needed.
      setLogoutError(null);
      console.log("[AuthContext] Logout successful, navigating to login.");
      navigate("/login");
    },
    onError: (err: Error) => {
      console.error("[AuthContext] Logout mutation error:", err);
      setLogoutError(err.message || "Logout failed. Please try again.");
      // Even on logout error, ensure client state is cleared as a precaution
      authService.removeAuthToken();
      queryClient.setQueryData(authUserQueryKey, null);
      navigate("/login"); // Still navigate to login
    },
  });

  // Added handleAuthCallback mutation/logic
  const handleAuthCallbackMutation = useMutation({
    mutationFn: async (token: string) => {
      authService.setAuthToken(token);
      // After setting the token, we need to trigger a user profile fetch.
      // Invalidating the query will cause useQuery to refetch.
      await queryClient.invalidateQueries({ queryKey: authUserQueryKey });
      // Ensure the fetch is complete before navigating or assuming success.
      const user = await queryClient.getQueryData(authUserQueryKey);
      if (!user) {
        // If after refetch, user is still null, it means token was invalid or user fetch failed.
        throw new Error("Failed to fetch user profile after auth callback.");
      }
    },
    onSuccess: () => {
      setCallbackError(null);
      console.log(
        "[AuthContext] Auth callback processed successfully, navigating to home."
      );
      navigate("/"); // Or to a stored redirect path
    },
    onError: (err: Error) => {
      console.error("[AuthContext] Auth callback error:", err);
      setCallbackError(
        err.message || "Authentication callback failed. Please try again."
      );
      authService.removeAuthToken();
      queryClient.setQueryData(authUserQueryKey, null);
      navigate("/login"); // Redirect to login on callback failure
    },
  });

  const authContextValue = useMemo(
    () => {
      const userFromQuery = userQuery.data || null;
      const tokenInMemory = authService.getAuthToken();
      const calculatedIsAuthenticated = !!userFromQuery && !!tokenInMemory;

      return {
        user: userFromQuery,
        isAuthenticated: calculatedIsAuthenticated,
        isLoading:
          userQuery.isLoading ||
          loginMutation.isPending ||
          logoutMutation.isPending ||
          handleAuthCallbackMutation.isPending, // Added callback pending state
        loginError,
        logoutError,
        userFetchError: userQuery.error?.message || null,
        callbackError, // Added callback error
        login: async (credentials: LoginInput) => {
          clearLoginError();
          await loginMutation.mutateAsync(credentials);
        },
        logout: async () => {
          clearLogoutError();
          await logoutMutation.mutateAsync();
        },
        handleAuthCallback: async (token: string) => {
          clearCallbackError();
          await handleAuthCallbackMutation.mutateAsync(token);
        },
        clearLoginError,
        clearLogoutError,
        clearUserFetchError,
        clearCallbackError, // Added
      };
    },
    [
      userQuery.data,
      userQuery.isLoading, // Added isLoading to dependencies
      userQuery.isError, // Added isError to dependencies
      userQuery.error,
      loginMutation.isPending,
      logoutMutation.isPending,
      handleAuthCallbackMutation.isPending, // Added
      loginError,
      logoutError,
      userQuery.error?.message, // For userFetchError
      callbackError, // Added
      queryClient,
      navigate,
    ]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
