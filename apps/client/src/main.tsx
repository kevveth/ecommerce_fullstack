import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router"; // Updated import
import "./index.css";
import App from "./App";
import { QueryClient } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// Import page and layout components
import { Home } from "./pages/Home/Home";
import { NotFound } from "./errors/NotFound";
import { Profile } from "./pages/Profile/Profile";
import { Profiles } from "./pages/Profiles/Profiles";
import PageLayout from "./components/PageLayout/PageLayout";
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
          <Routes>
            <Route element={<App />}>
              {/* App now acts as a root layout/context provider */}
              <Route element={<PageLayout />}>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                {/* Profile routes now public */}
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/profiles/:username" element={<Profile />} />
                <Route path="/my-profile" element={<MyProfile />} />
                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </SnackbarProvider>
      </PersistQueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
