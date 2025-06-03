// import { useParams } from "react-router";
// import { ProfileData } from "../../components/ProfileData";
// import { useEffect } from "react";

// interface ProfileParams {
//   username?: string;
// }

// // Mock user profile data for development
// const mockUserProfile = {
//   id: "1",
//   username: "demo-user",
//   email: "demo@example.com",
//   firstName: "Demo",
//   lastName: "User",
//   createdAt: new Date().toISOString(),
// };

// // Temporary mock hook - replace with actual TanStack Query hook later
// function useUserProfile(username?: string) {
//   return {
//     data: username ? mockUserProfile : null,
//     isPending: false,
//     isError: false,
//     error: null,
//   };
// }

// export function Profile() {
//   const { username } = useParams<ProfileParams>();
//   const {
//     data: userProfile,
//     isPending,
//     isError,
//     error,
//   } = useUserProfile(username);

//   // Log on component mount and when username changes
//   useEffect(() => {
//     console.log(`Profile component mounted with username param: ${username}`);
//   }, [username]);

//   if (isPending) {
//     return (
//       <div>
//         <p>Loading user data...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div>
//         <h1>Error fetching user</h1>
//         <p>
//           {error instanceof Error ? error.message : "Unknown error occurred"}
//         </p>
//         <p>Attempted to fetch user with username: {username}</p>
//       </div>
//     );
//   }

//   if (!username) {
//     return (
//       <div>
//         <h1>Profile</h1>
//         <p>No username provided in URL</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Profile</h1>
//       {userProfile ? (
//         <ProfileData data={userProfile} />
//       ) : (
//         <p>No user data available</p>
//       )}
//     </div>
//   );
// }
