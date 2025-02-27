import { useParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
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
    <PageLayout>
      <h1>Profile</h1>
      {user && <ProfileData data={user.data} />}
    </PageLayout>
  );
}
