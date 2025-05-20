import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router"; // Updated import
import "./index.css";
import App from "./App";
import { QueryClient } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "./context/AuthContext";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// Import page and layout components
import { Home } from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { NotFound } from "./errors/NotFound";
import { Profile } from "./pages/Profile/Profile";
import { Profiles } from "./pages/Profiles/Profiles";
import PageLayout from "./components/PageLayout/PageLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuthCallback from "./components/AuthCallback/AuthCallback";
import { MyProfile } from "./pages/MyProfile/MyProfile"; // Corrected import: Use named import

// Create a persister
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "ecommerce-app-query-cache",
});

// Enhanced QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      retry: (failureCount, error: any) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: localStoragePersister }}
      >
        <SnackbarProvider>
          <AuthProvider>
            {/* Routes are now defined here, wrapping App */}
            <Routes>
              <Route element={<App />}>
                {" "}
                {/* App now acts as a root layout/context provider */}
                <Route element={<PageLayout />}>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/success" element={<AuthCallback />} />

                  {/* Protected routes - wrapped with ProtectedRoute */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profiles" element={<Profiles />} />
                    <Route path="/profiles/:username" element={<Profile />} />
                    <Route path="/my-profile" element={<MyProfile />} />{" "}
                    {/* Add MyProfile route */}
                  </Route>

                  {/* Catch all */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </SnackbarProvider>
      </PersistQueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
