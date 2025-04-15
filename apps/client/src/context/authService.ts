import axios, { AxiosError, AxiosInstance } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

// Create a base axios instance
const api: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Function to set the auth token on all requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Function to refresh the access token
const refreshAuthLogic = async (failedRequest: any) => {
  try {
    // Call the refresh token endpoint
    const response = await axios.post(
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

// Login function
export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  const { accessToken } = response.data;
  setAuthToken(accessToken);
  return accessToken;
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
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    // If the request fails due to authentication issues
    if ((error as AxiosError).response?.status === 401) {
      setAuthToken(null);
    }
    throw error;
  }
};

export default api;
