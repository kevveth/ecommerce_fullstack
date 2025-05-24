/**
 * AuthService provides functions for authentication-related API calls.
 * It includes login, logout, and fetching the current user's data.
 */
import axios, { AxiosInstance, AxiosError } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import {
  type LoginInput,
  userSchema,
  User as SharedUser,
} from "@ecommerce/shared/schemas"; // Added SharedUser
import { z } from "zod/v4";

/**
 * Zod schema for validating authentication responses.
 */
const AuthResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string().optional().default("Bearer"), // Added default
  user: userSchema.optional(), // User can be optional if only token is returned (e.g. refresh)
});

type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Create a base axios instance
const api: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

/**
 * Stores the authentication token in memory.
 */
let authToken: string | null = null; // Initialize authToken as null

/**
 * Sets the authentication token in memory.
 * @param token - The authentication token to store.
 */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

/**
 * Retrieves the authentication token from memory (which is initialized from localStorage).
 * @returns The authentication token or null if not set.
 */
export function getAuthToken(): string | null {
  // Re-check localStorage in case it was modified by another tab/window
  // if (typeof window !== "undefined") { // Removed localStorage interaction
  //   const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
  //   if (authToken !== storedToken) {
  //     authToken = storedToken;
  //   }
  // }
  return authToken;
}

/**
 * Removes the authentication token from memory.
 */
export function removeAuthToken(): void {
  authToken = null;
}

// Update axios instance to include Authorization header dynamically
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Refreshes the access token when a 401 response is received.
 * @param failedRequest - The failed request that triggered the refresh.
 * @returns A promise that resolves when the token has been refreshed.
 */
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  try {
    console.log("[AuthService.refreshAuthLogic] Attempting token refresh...");
    const response = await api.post<{
      accessToken: string;
      tokenType?: string;
    }>("/auth/refresh-token", {}, { withCredentials: true });

    // Use a simpler schema for refresh response as user data is not expected
    const RefreshTokenResponseSchema = z.object({
      accessToken: z.string(),
      tokenType: z.string().optional().default("Bearer"),
    });

    const parsedResult = RefreshTokenResponseSchema.safeParse(response.data);
    if (!parsedResult.success) {
      console.error(
        "[AuthService.refreshAuthLogic] Invalid refresh token response:",
        z.prettifyError(parsedResult.error)
      );
      removeAuthToken(); // Ensure token is cleared on failed refresh parse
      return Promise.reject(
        new Error("Invalid server response format during token refresh.")
      );
    }

    const { accessToken } = parsedResult.data;
    setAuthToken(accessToken);

    if (failedRequest.config?.headers) {
      failedRequest.config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return Promise.resolve();
  } catch (error) {
    console.error(
      "[AuthService.refreshAuthLogic] Token refresh failed:",
      error
    );
    removeAuthToken(); // Clear token on any refresh error
    // IMPORTANT: Navigate to login or notify user
    // For now, just reject to let the original call fail.
    // Consider dispatching a global event or using a callback to trigger navigation.
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401], // Intercept 401 Unauthorized
  pauseInstanceWhileRefreshing: true,
});

/**
 * Fetches the current authenticated user's profile.
 * This function is intended to be used by the AuthContext.
 * @returns A promise that resolves to an object containing the authenticated user data.
 */
export const getAuthenticatedUserProfile = async (): Promise<{
  user: SharedUser;
}> => {
  try {
    // The server route /api/users/me should return { user: UserData }
    const response = await api.get<{ user: unknown }>("/users/me");
    const parsedResult = userSchema.safeParse(response.data.user);

    if (!parsedResult.success) {
      console.error(
        "[AuthService] Invalid user data from /users/me:",
        z.prettifyError(parsedResult.error)
      );
      throw new Error("Invalid user data received from server.");
    }
    return { user: parsedResult.data };
  } catch (error) {
    console.error(
      "[AuthService] Failed to fetch authenticated user profile:",
      error
    );
    // If it's a 401, axios-auth-refresh should handle it.
    // If refresh fails, it will throw, and TanStack Query will handle the error.
    // No need to call removeAuthToken() here as refreshAuthLogic or query error handling will manage it.
    throw error; // Re-throw to be caught by TanStack Query
  }
};

/**
 * Logs in a user with the provided credentials.
 * @param credentials - The user's login credentials.
 * @returns A promise that resolves to the authentication response.
 */
export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await api.post<unknown>("/auth/login", credentials);
    // The server /api/auth/login is expected to return { accessToken: string, tokenType: string, user: UserData }
    const parsedResult = AuthResponseSchema.safeParse(response.data);

    if (!parsedResult.success) {
      console.error(
        "[AuthService] Invalid login response:",
        z.prettifyError(parsedResult.error)
      );
      removeAuthToken();
      throw new Error("Login failed: Invalid response from server.");
    }

    const { accessToken, user, tokenType } = parsedResult.data; // Ensure tokenType is destructured
    if (!accessToken || !user || !tokenType) {
      // Ensure tokenType is checked
      console.error(
        "[AuthService] Login response missing accessToken, user data, or tokenType."
      );
      removeAuthToken();
      throw new Error("Login failed: Incomplete data from server.");
    }

    setAuthToken(accessToken);
    return { accessToken, user, tokenType }; // Return the full parsed and validated data
  } catch (error) {
    console.error("[AuthService] Login request failed:", error);
    removeAuthToken(); // Ensure token is cleared on login failure
    if (axios.isAxiosError(error) && error.response) {
      // Forward server error message if available
      const serverMessage =
        error.response.data?.message || "Invalid email or password.";
      throw new Error(serverMessage);
    }
    throw new Error("Login failed. Please try again.");
  }
};

/**
 * Logs out the current user.
 * @returns A promise that resolves when the logout is complete.
 */
export const logout = async (): Promise<void> => {
  try {
    // Call the server's logout endpoint to invalidate the refresh token server-side
    await api.post("/auth/logout");
    console.log("[AuthService] Logout successful on server.");
  } catch (error) {
    // Log the error but proceed with client-side cleanup
    console.error(
      "[AuthService] Server logout failed, proceeding with client cleanup:",
      error
    );
  } finally {
    // Always remove the token and clear client-side state
    removeAuthToken();
    // Query invalidation/reset will be handled in AuthContext
  }
};

// Default export of the configured axios instance
export default api;
