import { useParams } from "react-router";
import { ProfileData } from "../../components/ProfileData";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useEffect } from "react";

interface ProfileProps extends Record<string, string | undefined> {
  username: string;
}

export function Profile() {
  const { username } = useParams<ProfileProps>();
  const {
    data: userProfile,
    isPending,
    isError,
    error,
  } = useUserProfile(username);

  // Log on component mount and when username changes
  useEffect(() => {
    console.log(`Profile component mounted with username param: ${username}`);
  }, [username]);

  if (isPending) {
    return <p>Loading user data...</p>;
  }

  if (isError) {
    return (
      <div>
        <h1>Error fetching user</h1>
        <p>
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
        <p>Attempted to fetch user with username: {username}</p>
      </div>
    );
  }

  return (
    <>
      <h1>Profile</h1>
      {userProfile && <ProfileData data={userProfile} />}
      {!userProfile && <p>No user data available</p>}
    </>
  );
}
