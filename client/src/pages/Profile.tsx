import { useParams } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { ProfileData } from "../components/ProfileData";
import { useQuery } from "@tanstack/react-query";
import { type User } from "../../../server/src/models/user.model";
import { useFetchUser } from "../hooks/useFetchUser";

type ProfileProps = {
  username: string;
};

export function Profile() {
  const { username } = useParams<ProfileProps>();
  const { data: user, isPending, isError } = useFetchUser(username);

//   const {
//     data: user,
//     isError,
//     isPending,
//   } = useQuery({
//     queryKey: ["user", { username }],
//     queryFn: async () => {
//       const response = await fetch(
//         `http://localhost:3000/api/users/${username}`
//       );
//       return (await response.json()) as { data: User };
//     },
//     retry: 1,
//   });

  if (isPending) { return <p>Loading...</p> }

  if (isError) { return <p>Error fetching user</p> }

  return (
    <PageLayout>
      <h1>Profile</h1>
      {user && <ProfileData data={user.data} />}
    </PageLayout>
  );
}
