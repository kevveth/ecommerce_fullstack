import "./App.css";
import { Router } from "./components/Router";
import useRoutePersistence from "./hooks/useRoutePersistence";
import { useAuth } from "./context/AuthContext";

/**
 * Main application component
 * Includes route persistence to maintain the current route on page refresh
 */
function App() {
  const { isAuthenticated } = useAuth();

  // Only restore routes when authenticated
  useRoutePersistence(isAuthenticated);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
