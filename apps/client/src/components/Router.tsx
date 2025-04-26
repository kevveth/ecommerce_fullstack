import { Routes, Route, Navigate } from "react-router";
import { Home } from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import { NotFound } from "../errors/NotFound";
import { Profile } from "../pages/Profile/Profile";
import { Profiles } from "../pages/Profiles/Profiles";
import PageLayout from "./PageLayout/PageLayout";
import { useAuth } from "../context/AuthContext";

// Create a Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Protected routes */}
        <Route
          path="profiles"
          element={
            <ProtectedRoute>
              <Profiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="profiles/:username"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
