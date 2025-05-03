import axios, { AxiosError, AxiosInstance } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { LoginInput } from "@repo/shared/schemas";

// Create a base axios instance
const api: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Interface for auth responses
interface AuthResponse {
  accessToken: string;
  tokenType?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * Function to set the auth token on all requests
 *
 * @param token - The access token to set, or null to clear
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken");
  }
};

/**
 * Function to refresh the access token
 * This is called automatically when a 401 response is received
 *
 * @param failedRequest - The failed request that triggered the refresh
 * @returns Promise that resolves when the token has been refreshed
 */
const refreshAuthLogic = async (failedRequest: any) => {
  try {
    // Call the refresh token endpoint
    const response = await axios.post<AuthResponse>(
      "/api/auth/refresh-token",
      {},
      { withCredentials: true } // Important to include HttpOnly cookies
    );

    const { accessToken } = response.data;

    // Update the auth token for future requests
    setAuthToken(accessToken);

    // Update the failed request with the new token
    failedRequest.response.config.headers["Authorization"] =
      `Bearer ${accessToken}`;

    return Promise.resolve();
  } catch (error) {
    // If refresh fails, clear the token and redirect to login
    setAuthToken(null);
    return Promise.reject(error);
  }
};

// Setup the refresh interceptor
createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401], // Trigger refresh on 401 Unauthorized
  pauseInstanceWhileRefreshing: true, // Prevent other requests during refresh
});

// Initialize auth header from storage (if available)
const token = localStorage.getItem("accessToken");
if (token) {
  setAuthToken(token);
}

/**
 * Login function using the LoginInput type
 *
 * @param credentials - User login credentials
 * @returns Promise that resolves to the auth response
 */
export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    const { accessToken } = response.data;

    // Set token for future requests
    setAuthToken(accessToken);

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Logout function
 *
 * @returns Promise that resolves when logout is complete
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
    setAuthToken(null);
  } catch (error) {
    console.error("Logout error:", error);
    // Clear token even if the request fails
    setAuthToken(null);
  }
};

/**
 * Gets the current user profile
 *
 * @returns Promise that resolves to the user data
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get<AuthResponse>("/users/me");
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    // If the request fails due to authentication issues
    if ((error as AxiosError).response?.status === 401) {
      setAuthToken(null);
    }
    throw error;
  }
};

/**
 * Handle Google authentication callback
 *
 * @param token - The token received from Google
 * @returns Promise that resolves to the auth response
 */
export const handleGoogleAuthCallback = async (
  token: string
): Promise<AuthResponse> => {
  try {
    setAuthToken(token);
    const userData = await getCurrentUser();
    return userData;
  } catch (error) {
    console.error("Google auth callback error:", error);
    throw error;
  }
};

export default api;
