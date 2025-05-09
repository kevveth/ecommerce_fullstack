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
import { env } from "../utils/env";

/**
 * Represents the authenticated user.
 */
interface AuthUser {
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.getCurrentUser("me"); // Fetch current user data
        if (response.user) {
          const { user_id = 0, username, email, role } = response.user;
          setUser({ user_id, username, email, role });
        }
      } catch {
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
      const response = await authService.login({ email, password });
      if (response.user) {
        const { user_id = 0, username, email, role } = response.user;
        setUser({ user_id, username, email, role });
      }
    } catch {
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
