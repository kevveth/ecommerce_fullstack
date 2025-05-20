import "./App.css";
import { Router } from "./components/Router";
import { useRoutePersistence } from "./hooks/useRoutePersistence";
import { useAuth } from "./context/AuthContext"; // Corrected import

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
      <Router />
    </>
  );
}

export default App;
