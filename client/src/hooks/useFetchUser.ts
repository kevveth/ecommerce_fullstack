import { useEffect, useState } from "react";

export function useFetchUser(profileId: number) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchProfile = async () => {
        const response = await fetch(`/api/user/${profileId}`);
        const data = await response.json();
        setUserData(data);
    }

    fetchProfile();
  }, [profileId]);

  return userData;
}
