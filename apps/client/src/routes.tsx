import { Routes, Route } from "react-router";
import App from "./App";
import { PageLayout } from "./components/PageLayout/PageLayout";
import { Home } from "./pages/Home/Home";
import { NotFound } from "./errors/NotFound";
import { SignUp } from "./features/auth/SignUp/SignUp";
export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<App />}>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Auth */}
        <Route path="sign-up" element={<SignUp />} />
        {/* Protected */}
        <Route path="profile" element={<></>} />

        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
