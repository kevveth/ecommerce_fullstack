/**
 * Custom hook to fetch a user's public profile.
 */
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../context/authService"; // Changed from @/context/authService
import { type User, userSchema } from "@ecommerce/shared"; // Using the shared User type
import { z } from "zod";

// Zod schema for the expected API response structure
const UserProfileApiResponseSchema = z.object({
  user: userSchema, // Expecting the user object under a top-level 'user' key
});

/**
 * Fetches a user's public profile by username.
 * @param username - The username of the profile to fetch.
 * @returns A promise that resolves to the user's profile data.
 */
const fetchUserProfile = async (username: string): Promise<User> => {
  // Corrected the endpoint to match the server route /api/users/:username
  const response = await axiosInstance.get(`/users/${username}`);

  // Validate the structure of the response using UserProfileApiResponseSchema
  const parsedResult = UserProfileApiResponseSchema.safeParse(response.data);

  if (!parsedResult.success) {
    console.error(
      "Invalid user profile response structure:",
      z.prettifyError(parsedResult.error)
    );
    // Log the actual response data for debugging
    console.error("Actual response data:", response.data);
    throw new Error("Invalid server response format for user profile.");
  }
  // Return the user object from the nested 'user' key
  return parsedResult.data.user;
};

/**
 * Custom hook to fetch a user's public profile.
 * @param username - The username of the profile to fetch.
 * @returns The result of the TanStack Query for the user profile.
 */
export const useUserProfile = (username: string | undefined) => {
  return useQuery<User, Error>({
    queryKey: ["userProfile", username],
    queryFn: () => {
      if (!username) {
        // Immediately return a rejected promise or throw if username is undefined
        // This prevents the query from running with an undefined username
        return Promise.reject(new Error("Username is undefined"));
      }
      return fetchUserProfile(username);
    },
    enabled: !!username, // Only run the query if the username is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
