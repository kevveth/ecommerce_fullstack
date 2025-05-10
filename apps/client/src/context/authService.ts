/**
 * AuthService provides functions for authentication-related API calls.
 * It includes login, logout, and fetching the current user's data.
 */
import axios, { AxiosInstance, AxiosError } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { type LoginInput, userSchema } from "@ecommerce/shared";
import { z } from "zod";

/**
 * Zod schema for validating authentication responses.
 */
const AuthResponseSchema = z.object({
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
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  try {
    // Use the configured api instance instead of global axios
    const response = await api.post<{
      accessToken: string;
      tokenType?: string;
    }>(
      "/auth/refresh-token", // This path is relative to baseURL which is already set to '/api'
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

    // Update the Authorization header on the original request's config.
    // axios-auth-refresh uses failedRequest.config to retry the request.
    // The 'config' property on AxiosError (failedRequest.config) is of type InternalAxiosRequestConfig | undefined.
    // The 'headers' property on InternalAxiosRequestConfig is non-optional.
    if (failedRequest.config) {
      failedRequest.config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // If failedRequest.config is undefined, the library might not be able to retry the request.
    // This scenario is unlikely for a typical API request that would trigger a 401 error.

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
 * Explicitly refreshes the authentication token.
 * This function can be called directly when needed to refresh the token.
 *
 * @returns A promise resolving to an object containing the new access token, or null if refresh failed
 */
export const refreshAuthToken = async (): Promise<{
  accessToken: string;
} | null> => {
  try {
    const response = await api.post<{
      accessToken: string;
      tokenType?: string;
    }>("/auth/refresh-token", {}, { withCredentials: true });

    const parsedResult = AuthResponseSchema.safeParse(response.data);
    if (!parsedResult.success) {
      console.error(
        "Invalid refresh token response:",
        z.prettifyError(parsedResult.error)
      );
      return null;
    }

    const { accessToken } = parsedResult.data;
    setAuthToken(accessToken);
    return { accessToken };
  } catch (error) {
    console.error("Token refresh failed:", error);
    setAuthToken(null);
    return null;
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

    // Create a normalized response that matches our schema
    interface ServerLoginResponse {
      accessToken: string;
      tokenType?: string;
      user?: {
        id?: number;
        user_id?: number;
        username: string;
        email: string;
        role: string;
        password_hash?: string | null;
        [key: string]: unknown;
      };
    }

    let normalizedData: {
      accessToken: string;
      tokenType?: string;
      user?: {
        user_id?: number;
        username?: string;
        email?: string;
        role?: string;
        password_hash: string | null;
        [key: string]: unknown;
      };
    } = {
      accessToken: "",
      tokenType: "Bearer",
    };

    if (response.data && typeof response.data === "object") {
      // Extract the main fields we expect
      const responseData = response.data as ServerLoginResponse;

      normalizedData = {
        accessToken: responseData.accessToken,
        tokenType: responseData.tokenType || "Bearer",
      };

      // Handle the user object if it exists
      if (responseData.user) {
        normalizedData.user = {
          ...responseData.user,
          // Ensure password_hash is null if undefined (to match our schema)
          password_hash: responseData.user.password_hash || null,
          // Normalize the id field if necessary
          user_id: responseData.user.id || responseData.user.user_id,
        };
      }
    }

    // Now validate with our schema
    const parsedResult = AuthResponseSchema.safeParse(normalizedData);
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

    // Make the request with the current auth token
    const response = await api.get<unknown>(endpoint);

    // Define interfaces for the different response formats
    interface UserData {
      user_id?: number;
      id?: number;
      username?: string;
      email?: string;
      role?: string;
      password_hash?: string | null;
      [key: string]: unknown;
    }

    interface UserResponse {
      user?: UserData;
      data?: UserData;
      accessToken?: string;
    }

    // Create a normalized response that matches our schema
    let userData: {
      accessToken: string;
      user?: {
        user_id?: number;
        username?: string;
        email?: string;
        role?: string;
        password_hash: string | null;
        [key: string]: unknown;
      };
    } = {
      accessToken: getAuthToken() || "",
    };

    if (response.data && typeof response.data === "object") {
      const responseData = response.data as UserResponse;

      // Handle the standard user response format
      if ("user" in responseData && responseData.user) {
        userData = {
          accessToken: getAuthToken() || "",
          user: {
            ...responseData.user,
            // Ensure password_hash is null if undefined (to match our schema)
            password_hash: responseData.user.password_hash || null,
            // Normalize the id field if necessary
            user_id: responseData.user.id || responseData.user.user_id,
          },
        };
      }
      // Handle data format from other endpoints
      else if ("data" in responseData && responseData.data) {
        userData = {
          accessToken: getAuthToken() || "",
          user: {
            ...responseData.data,
            password_hash: responseData.data.password_hash || null,
            user_id: responseData.data.id || responseData.data.user_id,
          },
        };
      }
      // If response already has accessToken and user fields
      else if (
        "accessToken" in responseData &&
        "user" in responseData &&
        responseData.user
      ) {
        userData = {
          accessToken: responseData.accessToken || getAuthToken() || "",
          user: {
            ...responseData.user,
            password_hash: responseData.user.password_hash || null,
            user_id: responseData.user.id || responseData.user.user_id,
          },
        };
      }
    }

    // Now validate with our schema
    const parsedResult = AuthResponseSchema.safeParse(userData);
    if (!parsedResult.success) {
      console.error(
        "Invalid user data format:",
        z.prettifyError(parsedResult.error)
      );
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
