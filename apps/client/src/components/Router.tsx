import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "../pages/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import { NotFound } from "../errors/NotFound";
import { Profile } from "../pages/Profile";
import { Profiles } from "../pages/Profiles";
import { MyProfile } from "../pages/MyProfile";
import PageLayout from "./PageLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { useEffect } from "react";

export const Router: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        element={
          <PageLayout
            pageTitle={
              location.pathname === "/"
                ? "Welcome to Ken's Coffee Company"
                : undefined
            }
          />
        }
      >
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/profiles/:username" element={<Profile />} />
          <Route path="/profile" element={<MyProfile />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          {/* Placeholder for admin routes */}
          <Route path="/admin" element={<NotFound />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
