import "./App.css";
// Router import removed
import { useRoutePersistence } from "./hooks/useRoutePersistence";
import { useAuth } from "./context/AuthContext"; // Corrected import
import { Outlet } from "react-router"; // Import Outlet

/**
 * Main application component
 * Includes route persistence to maintain the current route on page refresh
 */
function App() {
  const { isAuthenticated } = useAuth(); // Corrected usage

  // Only restore routes when authenticated
  useRoutePersistence(isAuthenticated);

  return (
    <>
      {/* Router component removed, Outlet added */}
      <Outlet />
    </>
  );
}

export default App;
