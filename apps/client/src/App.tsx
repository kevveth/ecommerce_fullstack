import "./App.css";
// Router import removed
import { useRoutePersistence } from "./hooks/useRoutePersistence";
import { useAuth } from "./context/AuthContext"; // Corrected import
import { Outlet } from "react-router"; // Import Outlet
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "./components/ErrorBoundary/FallbackComponent";

/**
 * Main application component
 * Includes route persistence to maintain the current route on page refresh
 */
function App() {
  const { isAuthenticated } = useAuth(); // Corrected usage

  // Only restore routes when authenticated
  useRoutePersistence(isAuthenticated);

  /**
   * Logs errors caught by the ErrorBoundary to the console.
   * @param {Error} error - The error that was caught.
   * @param {React.ErrorInfo} info - An object with a componentStack key containing information about which component crashed.
   */
  const logError = (error: Error, info: React.ErrorInfo) => {
    // You could send errors to a logging service here
    console.error("Caught an error:", error, info);
  };

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={logError}>
      {/* Router component removed, Outlet added */}
      <Outlet />
    </ErrorBoundary>
  );
}

export default App;
