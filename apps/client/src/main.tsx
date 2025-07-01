import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router"; // Updated import
import { AppRoutes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@workspace/ui/globals.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
