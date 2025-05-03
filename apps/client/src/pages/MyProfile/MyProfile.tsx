import { useEffect } from "react";
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

  // Redirect to the user's profile page using the correct username
  return <Navigate to={`/profiles/${user.username}`} replace />;
}
