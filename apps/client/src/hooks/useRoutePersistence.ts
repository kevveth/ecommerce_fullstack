/**
 * Custom hook to persist the current route in localStorage
 * and restore it on page refresh
 */
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const ROUTE_STORAGE_KEY = "last-route";

/**
 * Custom hook that saves the current route to localStorage and can restore it after page refresh
 * @param shouldRestore - Whether to restore the saved route (default: true)
 * @param excludePaths - Array of paths that should not be saved (e.g., login page)
 */
export const useRoutePersistence = (
  shouldRestore: boolean = true,
  excludePaths: string[] = ["/login", "/register", "/auth/success"]
): void => {
  const location = useLocation();
  const navigate = useNavigate();

  // Save current path to localStorage whenever location changes
  useEffect(() => {
    const currentPath = location.pathname;

    // Don't save excluded paths
    if (!excludePaths.includes(currentPath)) {
      localStorage.setItem(ROUTE_STORAGE_KEY, currentPath);
    }
  }, [location.pathname, excludePaths]);

  // Restore saved path on mount if needed
  useEffect(() => {
    if (shouldRestore) {
      const savedPath = localStorage.getItem(ROUTE_STORAGE_KEY);

      // Only navigate if there's a saved path and we're not already on that path
      if (savedPath && savedPath !== "/" && savedPath !== location.pathname) {
        navigate(savedPath, { replace: true });
      }
    }
  }, [shouldRestore, navigate, location.pathname]);
};

export default useRoutePersistence;
