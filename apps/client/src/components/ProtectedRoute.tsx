import { Navigate, useLocation, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  requiredRole?: string;
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You could show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated, but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check the user's role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to unauthorized page or home page
    return <Navigate to="/" replace />;
  }

  // If authenticated and has the required role (if specified), render the children
  return <Outlet />;
};
