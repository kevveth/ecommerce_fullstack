import { PageLayout } from "../components/PageLayout";
import { ProfileData } from "../components/ProfileData";
import { useFetchUser } from "../hooks/useFetchUser";

type ProfileProps = {
    userId: number
};


export function Profile({ userId }: ProfileProps) {
    const profileData = useFetchUser(userId);

    return (
    <PageLayout>
      <h1>Profile</h1>
      <ProfileData data={profileData} />
    </PageLayout>
  );
}