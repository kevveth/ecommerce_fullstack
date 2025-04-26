import { Routes, Route, useLocation } from "react-router";
import { Home } from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import { NotFound } from "../errors/NotFound";
import { Profile } from "../pages/Profile/Profile";
import { Profiles } from "../pages/Profiles/Profiles";
import PageLayout from "./PageLayout/PageLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export const Router: React.FC = () => {
  const location = useLocation();
  console.log(location); //Log location for debugging

  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* protected routes - wrapped with ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/profiles/:username" element={<Profile />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
