import { useQuery } from '@tanstack/react-query';
import { User } from '../../../server/src/models/user.model';

interface Users {
  data: User[];
}

export function Profiles() {
  const {
    data: users,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/users/`);
      return (await response.json()) as Users;
    },
    retry: 1,
  });

  return (
    <>
      <>
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
      </>
    </>
  );
}
