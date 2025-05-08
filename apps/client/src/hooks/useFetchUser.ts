import { useQuery } from "@tanstack/react-query";
import type { User } from "../../../server/src/models/user.model";
import { env } from "../utils/env";

/**
 * Hook to fetch user data by username
 * @param username - The username to fetch data for
 * @returns Object containing user data, loading state, and error state
 */
export function useFetchUser(username?: string) {
  if (!username) {
    throw new Error("Username is required");
  }

  // Get API URL from our centralized environment configuration
  const baseUrl = new URL(env.VITE_API_URL).origin;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["user", { username }],
    queryFn: async () => {
      console.log(`Fetching user data for username: ${username}`);

      const url = `${baseUrl}/api/users/${username}`;
      console.log(`API request URL: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        // Parse error response for more detailed error handling
        const errorData = await response.json();
        console.error("Error fetching user:", errorData);
        throw new Error(
          errorData.message || `Failed to fetch user data: ${response.status}`
        );
      }

      const userData = await response.json();
      console.log("User data received:", userData);
      return userData as { data: User };
    },
  });

  return { data, isPending, isError, error };
}
