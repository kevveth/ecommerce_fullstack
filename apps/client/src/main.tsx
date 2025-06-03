import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router"; // Updated import
import "./index.css";
import App from "./App";

// Import page and layout components
import { Home } from "./pages/Home/Home";
import { NotFound } from "./errors/NotFound";
// import { Profile } from "./pages/Profile/Profile";
import { Profiles } from "./pages/Profiles/Profiles";
import PageLayout from "./components/PageLayout/PageLayout";
import { MyProfile } from "./pages/MyProfile/MyProfile"; // Corrected import: Use named import

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* App now acts as a root layout/context provider */}
          <Route element={<PageLayout />}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            {/* Profile routes now public */}
            <Route path="/profiles" element={<Profiles />} />
            {/* <Route path="/profiles/:username" element={<Profile />} /> */}
            <Route path="/my-profile" element={<MyProfile />} />
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
