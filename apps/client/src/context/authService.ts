/**
 * AuthService provides functions for authentication-related API calls.
 * It includes login, logout, and fetching the current user's data.
 */
import axios, { AxiosInstance } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { type LoginInput, userSchema } from "@ecommerce/shared";
import { z } from "zod";

/**
 * Zod schema for validating authentication responses.
 */
const AuthResponseSchema = z.interface({
  accessToken: z.string(),
  tokenType: z.string().optional(),
  user: userSchema.optional(),
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
let authToken: string | null = null;

/**
 * Sets the authentication token in memory.
 * @param token - The authentication token to store.
 */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

/**
 * Retrieves the authentication token from memory.
 * @returns The authentication token or null if not set.
 */
export function getAuthToken(): string | null {
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
const refreshAuthLogic = async (failedRequest: any) => {
  try {
    // Use the configured api instance instead of global axios
    const response = await api.post<unknown>(
      "/auth/refresh-token",
      {},
      { withCredentials: true }
    );

    const parsedResult = AuthResponseSchema.safeParse(response.data);
    if (!parsedResult.success) {
      console.error(
        "Invalid refresh token response:",
        z.prettifyError(parsedResult.error)
      );
      throw new Error("Invalid server response format");
    }

    const { accessToken } = parsedResult.data;
    setAuthToken(accessToken);
    failedRequest.response.config.headers["Authorization"] =
      `Bearer ${accessToken}`;

    return Promise.resolve();
  } catch (error) {
    setAuthToken(null);
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

/**
 * Logs in a user with the provided credentials.
 * @param credentials - The user's login credentials.
 * @returns A promise that resolves to the authentication response.
 */
export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await api.post<unknown>("/auth/login", credentials);

    const parsedResult = AuthResponseSchema.safeParse(response.data);
    if (!parsedResult.success) {
      console.error(
        "Invalid login response:",
        z.prettifyError(parsedResult.error)
      );
      throw new Error("Invalid server response format");
    }

    const { accessToken } = parsedResult.data;
    setAuthToken(accessToken);

    return parsedResult.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Logs out the current user.
 * @returns A promise that resolves when the logout is complete.
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
    setAuthToken(null);
  } catch (error) {
    console.error("Logout error:", error);
    setAuthToken(null);
  }
};

/**
 * Fetches the current user's profile data.
 * @param username - The username of the user or "me" for the current user.
 * @returns A promise that resolves to the user's data.
 */
export const getCurrentUser = async (
  username: string
): Promise<AuthResponse> => {
  try {
    // If username is "me", use the /users/me endpoint explicitly
    const endpoint = username === "me" ? "/users/me" : `/users/${username}`;

    // Log the current auth token status before making the request
    const hasToken = !!getAuthToken();
    console.log(
      `getCurrentUser: Fetching from ${endpoint}, Auth token present: ${hasToken}`
    );

    // Make the request with the current auth token
    const response = await api.get<unknown>(endpoint);

    // Log the raw response for troubleshooting
    console.log("getCurrentUser raw response:", response.data);

    // Create a modified response that matches our schema expectations
    // The server response shape is { user: { ...userData } }
    let userData: any = {};

    if (response.data && typeof response.data === "object") {
      // Handle the standard user response format
      if ("user" in response.data) {
        const user = (response.data as any).user;

        // Ensure user has all required fields with proper types
        userData = {
          accessToken: getAuthToken() || "",
          user: {
            ...user,
            // Ensure password_hash is null if undefined (to match our schema)
            password_hash: user.password_hash || null,
          },
        };
      }
      // Handle data format from other endpoints
      else if ("data" in response.data) {
        const user = (response.data as any).data;
        userData = {
          accessToken: getAuthToken() || "",
          user: {
            ...user,
            password_hash: user.password_hash || null,
          },
        };
      }
      // If response already has accessToken and user fields
      else if ("accessToken" in response.data && "user" in response.data) {
        const { accessToken, user } = response.data as any;
        userData = {
          accessToken,
          user: {
            ...user,
            password_hash: user.password_hash || null,
          },
        };
      }
    }

    console.log("Normalized user data:", userData);

    // Now validate with our schema
    const parsedResult = AuthResponseSchema.safeParse(userData);
    if (!parsedResult.success) {
      console.error(
        "Invalid user data format:",
        z.prettifyError(parsedResult.error)
      );
      console.error("Raw data received:", userData);
      throw new Error("Invalid server response format");
    }

    return parsedResult.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export { api };

export default api;
