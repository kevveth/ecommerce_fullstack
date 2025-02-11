import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "../components/PageLayout";
import { User } from "../../../server/src/models/user.model";

type Users = {
    data: User[];
}

export function Profiles() {
    const {
        data: users,
        isError,
        isPending,
      } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
          const response = await fetch(
            `http://localhost:3000/api/users/`
          );
          return (await response.json()) as Users;
        },
        retry: 1,
      });

  return (
    <>
      <PageLayout>
        <h1>Profiles</h1>
        {isPending && <p>Loading...</p>}
        {isError && <p>Error fetching users</p>}
        {users ? (
            <ul>
                {users.data.map((user) => (
                    <li key={user.user_id}>{user.username}</li>
                ))}
            </ul>
        ) : (
            <p>No users found</p>
        )}
      </PageLayout>
    </>
  );
}
