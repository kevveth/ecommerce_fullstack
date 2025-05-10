/**
 * AuthContext provides authentication state and actions to the application.
 * Enhanced with TanStack Query for improved data fetching and state management.
 */
import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  persistQueryClientRestore,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import * as authService from "./authService";

/**
 * Represents the authenticated user.
 */
export interface AuthUser {
  user_id?: number;
  username: string;
  email: string;
  role: string;
}

/**
 * Defines the shape of the authentication context.
 */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
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
  queryClient: QueryClient;
}

// Create a storage persister
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "auth-cache", // key in localStorage where cache will be stored
});

/**
 * AuthProvider component that manages authentication state using TanStack Query.
 */
export const AuthProvider = ({ children, queryClient }: AuthProviderProps) => {
  // Local state for error handling
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Clear error helper function
  const clearError = () => setError(null);

  /**
   * Main authentication query - fetches user data if authenticated
   */
  const userQuery = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        // Skip if no cookies
        if (document.cookie.length === 0) {
          return null;
        }

        // Attempt to refresh token and get user data
        const refreshResult = await authService.refreshAuthToken();

        if (refreshResult?.accessToken) {
          const userResponse = await authService.getCurrentUser("me");

          if (userResponse?.user) {
            return {
              user_id: userResponse.user.user_id,
              username: userResponse.user.username,
              email: userResponse.user.email,
              role: userResponse.user.role,
            };
          }
        }
        return null;
      } catch (error) {
        console.error("Auth query error:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - important for persistence
    refetchOnWindowFocus: false,
    retry: false,
  });

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return authService.login({ email, password });
    },
    onSuccess: (data) => {
      if (data.user) {
        // Update query cache directly with user data
        queryClient.setQueryData(["auth", "user"], {
          user_id: data.user.user_id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
        });

        // Persist the updated cache to localStorage
        persistQueryClientRestore({
          queryClient,
          persister: localStoragePersister,
        });
      }
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Failed to login");
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth data
      authService.removeAuthToken();
      queryClient.setQueryData(["auth", "user"], null);

      // Persist the cleared cache to localStorage
      persistQueryClientRestore({
        queryClient,
        persister: localStoragePersister,
      });

      navigate("/login");
    },
    onError: () => {
      // Force logout even on error
      authService.removeAuthToken();
      queryClient.setQueryData(["auth", "user"], null);

      // Persist the cleared cache to localStorage
      persistQueryClientRestore({
        queryClient,
        persister: localStoragePersister,
      });

      navigate("/login");
    },
  });

  /**
   * Token refresh mutation
   */
  const refreshTokenMutation = useMutation({
    mutationFn: authService.refreshAuthToken,
    onSuccess: (data) => {
      if (data?.accessToken) {
        // Trigger refetch of user data
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        return true;
      }
      return false;
    },
  });

  // Derive auth state from query data
  // Ensure user is AuthUser | null, not undefined
  const user = userQuery.data ?? null;
  const isAuthenticated = !!user;
  const isLoading = userQuery.isLoading;

  // Auth methods
  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const loginWithGoogle = () => {
    console.info("Google login flow initiated");
    // Implementation would go here
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const refreshToken = async () => {
    const result = await refreshTokenMutation.mutateAsync();
    return !!result?.accessToken;
  };

  // Create context value
  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      loginWithGoogle,
      logout,
      refreshToken,
      clearError,
    }),
    [user, isLoading, error, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Wrapper component that combines AuthProvider with PersistQueryClientProvider.
 */
interface PersistAuthProviderProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export const PersistAuthProvider = ({
  children,
  queryClient,
}: PersistAuthProviderProps) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      }}
      onSuccess={() => {
        console.info("Successfully restored auth state");
      }}
    >
      <AuthProvider queryClient={queryClient}>{children}</AuthProvider>
    </PersistQueryClientProvider>
  );
};

export default AuthContext;
