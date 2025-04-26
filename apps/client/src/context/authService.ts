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
  user: {
    user_id: number;
    username: string;
    email: string;
    role: string;
  };
}

// Function to set the auth token on all requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accessToken", token); // Optional: store in localStorage
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken"); // Optional: remove from localStorage
  }
};

// Function to refresh the access token
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

// Login function using the LoginInput type
export const login = async (loginData: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", loginData);
    const { accessToken } = response.data;
    setAuthToken(accessToken);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await api.post("/auth/logout");
    setAuthToken(null);
  } catch (error) {
    console.error("Logout error:", error);
    // Even if the logout API fails, still clear the token locally
    setAuthToken(null);
    throw error;
  }
};

// Get current user profile with proper typing
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get<AuthResponse>("/users/profile");
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

export default api;
