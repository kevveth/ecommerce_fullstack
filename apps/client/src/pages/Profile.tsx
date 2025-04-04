import { useParams } from 'react-router';
import { ProfileData } from '../components/ProfileData';
import { useFetchUser } from '../hooks/useFetchUser';

interface ProfileProps extends Record<string, string | undefined> {
  username: string;
}

export function Profile() {
  const { username } = useParams<ProfileProps>();
  const { data: user, isPending, isError } = useFetchUser(username);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching user</p>;
  }

  return (
    <>
      <h1>Profile</h1>
      {user && <ProfileData data={user.data} />}
    </>
  );
}
