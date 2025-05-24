import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export function MyProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the username is undefined and handle it gracefully
  if (!user.username) {
    return <p>Error: Username is missing. Please try again later.</p>;
  }

  // Redirect to the user's profile page using the correct username
  return <Navigate to={`/profiles/${user.username}`} replace />;
}
