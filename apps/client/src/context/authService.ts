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
  try {
    return jose.decodeJwt(token);
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
};

/**
 * Refreshes the access token when a 401 response is received.
 * @param failedRequest - The failed request that triggered the refresh.
 * @returns A promise that resolves when the token has been refreshed.
 */
const refreshAuthLogic = async (failedRequest: any) => {
  try {
    const response = await axios.post<unknown>(
      "/api/auth/refresh-token",
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
 * @param username - The username of the user.
 * @returns A promise that resolves to the user's data.
 */
export const getCurrentUser = async (
  username: string
): Promise<AuthResponse> => {
  try {
    const response = await api.get<unknown>(`/users/${username}`);

    const parsedResult = AuthResponseSchema.safeParse(response.data);
    if (!parsedResult.success) {
      console.error("Invalid user data:", z.prettifyError(parsedResult.error));
      throw new Error("Invalid server response format");
    }

    return parsedResult.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export default api;
