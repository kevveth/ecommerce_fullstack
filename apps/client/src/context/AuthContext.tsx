import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router";
import * as authService from "./authService";
import { User, LoginInput } from "@repo/shared/schemas";

// Define the auth user type (subset of full User type)
interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

// Define the context type with improved error handling
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  handleAuthCallback: (token: string) => Promise<any>;
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
  handleAuthCallback: async () => ({}),
  logout: async () => {},
});

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Create the Auth Provider component
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
        setUser(userData.user);
      } catch (err) {
        // Clear any existing tokens if verification fails
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a proper login input object and pass it to the service
      const loginData: LoginInput = { email, password };
      const response = await authService.login(loginData);
      setUser(response.user);
    } catch (err: any) {
      // Improved error handling to handle different error response formats
      let errorMessage = "Failed to login";

      if (err.response?.data) {
        // Handle structured Zod validation errors
        if (err.response.data.errors) {
          try {
            const fieldErrors: string[] = [];

            // Extract field errors using a safer approach
            Object.entries(err.response.data.errors).forEach(
              ([field, value]) => {
                // Skip the _errors property at the root level
                if (field === "_errors") {
                  const rootErrors = Array.isArray(value) ? value : [];
                  if (rootErrors.length > 0) {
                    fieldErrors.push(...rootErrors);
                  }
                }
                // Handle nested field errors (_errors array within each field)
                else if (
                  value &&
                  typeof value === "object" &&
                  "_errors" in value
                ) {
                  const errors = Array.isArray(value._errors)
                    ? value._errors
                    : [];
                  if (errors.length > 0) {
                    fieldErrors.push(`${field}: ${errors.join(", ")}`);
                  }
                }
              }
            );

            if (fieldErrors.length > 0) {
              errorMessage = fieldErrors.join("; ");
            } else {
              errorMessage = err.response.data.message || errorMessage;
            }
          } catch (parseErr) {
            console.error("Error parsing validation errors:", parseErr);
            errorMessage = err.response.data.message || errorMessage;
          }
        }
        // Handle simple message errors
        else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        // Handle direct error message
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed Google login handler with absolute URL
  const loginWithGoogle = () => {
    // Use the server URL directly instead of relying on environment variables
    // Default to localhost:3001 if not in production
    const serverUrl =
      process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_SERVER_URL
        : "http://localhost:3001";

    window.location.href = `${serverUrl}/api/auth/google`;
  };

  // Add function to handle token from URL after Google redirect
  const handleAuthCallback = async (token: string) => {
    try {
      // Store the token
      authService.setAuthToken(token);

      // Get the current user data
      const userData = await authService.getCurrentUser();
      setUser(userData.user);
      return userData;
    } catch (err: any) {
      setError("Failed to process authentication");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to logout");
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
