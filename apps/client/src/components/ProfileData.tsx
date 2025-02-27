import type { User } from '../../../server/src/models/user.model';

interface ProfileDataProps {
  data?: User;
}

export function ProfileData({ data: user }: ProfileDataProps) {
  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        {user.city}, {user.state}
      </p>
    </>
  );
}
