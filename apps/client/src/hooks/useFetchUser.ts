import { useQuery } from "@tanstack/react-query";
import type { User } from "../../../server/src/models/user.model";

export function useFetchUser(username?: string) {
  if (!username) {
    throw new Error("Username is required)");
  }

  const { data, isPending, isError } = useQuery({
    queryKey: ["user", { username }],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/api/users/${username}`,
      );
      return (await response.json()) as { data: User };
    },
  });

  return { data, isPending, isError };
}
