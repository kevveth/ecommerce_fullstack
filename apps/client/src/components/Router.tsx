import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "../pages/Home";
// import About from './pages/About';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import { NotFound } from "../errors/NotFound";
import { Profile } from "../pages/Profile";
import { Profiles } from "../pages/Profiles";
import { PageLayout } from "./PageLayout";

export const Router: React.FC = () => {
  const location = useLocation();
  console.log(location); //Log location for debugging

  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected routes */}
        <Route path="/" element={<Home />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/profiles/:username" element={<Profile />} />

        {/* catch all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
