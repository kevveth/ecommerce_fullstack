import { Routes, Route } from "react-router";
import App from "./App";
import { PageLayout } from "./components/PageLayout/PageLayout";
import { Home } from "./pages/Home/Home";
import { NotFound } from "./errors/NotFound";
import { SignUp } from "./features/auth/SignUp/SignUp";
import { SignIn } from "./features/auth/SignIn/SignIn";
import { SignOut } from "./features/auth/SignOut/SignOut";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<App />}>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />

          {/* Auth */}
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-out" element={<SignOut />} />
          {/* Protected */}
          <Route path="profile" element={<></>} />

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
