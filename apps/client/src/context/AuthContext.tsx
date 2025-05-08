import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router";
import * as authService from "./authService";
import { type LoginInput, type User } from "@ecommerce/shared";
import { env } from "../utils/env";
import { z } from "zod";

/**
 * Auth user type used within the application
 */
interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

// Using the type from authService to ensure consistency
type AuthResponse = Awaited<ReturnType<typeof authService.login>>;

/**
 * Auth context interface defining all available authentication operations
 */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  handleAuthCallback: (token: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  loginWithGoogle: () => {},
  handleAuthCallback: async () => ({}) as AuthResponse,
  logout: async () => {},
});

/**
 * Custom hook to access the auth context
 * @returns Authentication context value
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Transforms API user data into AuthUser format
 * @param apiUser - User data from API
 * @returns AuthUser object or null
 */
function transformUserData(
  apiUser: AuthResponse["user"] | undefined
): AuthUser | null {
  if (!apiUser || apiUser.user_id === undefined) return null;

  return {
    user_id: apiUser.user_id,
    username: apiUser.username,
    email: apiUser.email,
    role: apiUser.role,
  };
}

/**
 * Authentication provider component that manages user authentication state
 * @param props - Component props
 * @returns AuthProvider component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if the user is already authenticated (on page refresh/initial load)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(transformUserData(userData.user));
      } catch (err) {
        // Clear any existing tokens if verification fails
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Log in with email and password
   * @param email - User's email
   * @param password - User's password
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a proper login input object and pass it to the service
      const loginData: LoginInput = { email, password };
      const response = await authService.login(loginData);
      setUser(transformUserData(response.user));
    } catch (err: unknown) {
      // Improved error handling to handle different error response formats
      let errorMessage = "Failed to login";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Handle structured API errors
      if (err && typeof err === "object" && "response" in err) {
        const errorObj = err as {
          response?: { data?: { message?: string; errors?: unknown } };
        };
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        }

        // Handle Zod validation errors
        if (errorObj.response?.data?.errors instanceof z.ZodError) {
          errorMessage = z.prettifyError(errorObj.response.data.errors);
        }
      }

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Redirect to Google OAuth login
   */
  const loginWithGoogle = () => {
    // Get API URL origin from our centralized environment config
    const serverUrl = new URL(env.VITE_API_URL).origin;
    window.location.href = `${serverUrl}/api/auth/google`;
  };

  /**
   * Handle token from URL after Google redirect
   * @param token - The access token to process
   */
  const handleAuthCallback = async (token: string): Promise<AuthResponse> => {
    try {
      // Store the token
      authService.setAuthToken(token);

      // Get the current user data
      const userData = await authService.getCurrentUser();
      setUser(transformUserData(userData.user));
      return userData;
    } catch (err: unknown) {
      setError("Failed to process authentication");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);
      navigate("/login");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || "Failed to logout");
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
    handleAuthCallback,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
