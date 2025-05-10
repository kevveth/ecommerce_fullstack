/**
 * AuthContext provides authentication state and actions to the application.
 * It includes user data, authentication status, and methods for login, logout, and more.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router";
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
}

// Default context value to ensure type safety
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  loginWithGoogle: () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

/**
 * Custom hook to access the AuthContext.
 * @returns The authentication context value.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Props for the AuthProvider component.
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that manages authentication state and provides it to the application.
 * @param props - The children components to wrap with the provider.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Add logging whenever user state changes
  useEffect(() => {
    console.log("AuthContext: User state changed", {
      isAuthenticated: !!user,
      user,
    });
  }, [user]);

  useEffect(() => {
    /**
     * Initializes authentication state on app load.
     * Attempts to refresh the access token using the refresh token cookie,
     * then fetches the current user if successful.
     */
    const initializeAuth = async () => {
      try {
        console.log("AuthContext: Attempting to refresh token on app load...");

        // Attempt to refresh the access token using the refresh token cookie
        const refreshResponse = await authService.api.post<any>(
          "/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        // Make sure we update the token in memory
        if (refreshResponse.data?.accessToken) {
          console.log("AuthContext: Successfully refreshed token");
          authService.setAuthToken(refreshResponse.data.accessToken);
        } else {
          console.log("AuthContext: No access token in refresh response");
        }

        // Now fetch the current user (will use the new access token)
        console.log("AuthContext: Fetching current user...");
        const response = await authService.getCurrentUser("me");

        if (response.user) {
          console.log(
            "AuthContext: User fetch successful",
            response.user.username
          );
          const { user_id = 0, username, email, role } = response.user;
          setUser({ user_id, username, email, role });
          console.log("AuthContext: User state updated with:", {
            user_id,
            username,
            email,
            role,
          });
        } else {
          console.log("AuthContext: User data missing in response");
        }
      } catch (error) {
        console.error("AuthContext initialization error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("AuthContext: Attempting login...");
      const response = await authService.login({ email, password });
      console.log("AuthContext: Login successful, response:", response);

      if (response.user) {
        const { user_id = 0, username, email, role } = response.user;
        console.log("AuthContext: Setting user state after login:", {
          user_id,
          username,
          email,
          role,
        });
        setUser({ user_id, username, email, role });
      } else {
        console.log("AuthContext: No user data in login response");
      }
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = (): void => {
    console.log(
      "Google OAuth flow initiated (credentials not provided yet). Clicked the button."
    );
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);
      navigate("/login");
    } catch {
      setError("Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
