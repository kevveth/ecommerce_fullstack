import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { useLocation, Link, Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import styles from "./styles.module.css";
import { LoginInput } from "../../../../../packages/shared/dist/esm/schemas";

const ROUTE_STORAGE_KEY = "last-route";

/**
 * Login page component handles user authentication and redirects
 * appropriately based on authentication status.
 */
const Login = () => {
  // Use loginError from useAuth() for login-specific errors
  const { login, loginError, isAuthenticated } = useAuth();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromLocation = location.state?.from;
  const redirectPath =
    fromLocation?.pathname || localStorage.getItem(ROUTE_STORAGE_KEY) || "/";
  const redirectMessage = location.state?.message || null;

  // Declarative redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleLoginSubmit = async (data: LoginInput) => {
    // AuthContext's login function (loginMutation) already calls clearLoginError.
    setIsSubmitting(true);
    try {
      await login(data);
      // On successful login, AuthContext's onSuccess navigates.
    } catch (err) {
      // Errors are set in AuthContext by the loginMutation's onError handler.
      // This catch block in Login.tsx will also catch the error thrown by await login(data).
      // We primarily rely on loginError from AuthContext to display the error.
      console.error("Login attempt failed in Login.tsx catch block:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className={styles.loginTitle}>Login</h1>
      {/* Display redirectMessage if it exists */}
      {redirectMessage && <div className="info-message">{redirectMessage}</div>}
      {/* Display loginError from context */}
      {loginError && <div className="error-message">{loginError}</div>}
      {isSubmitting ? (
        <div className="spinner">Logging in...</div>
      ) : (
        <>
          <LoginForm submit={handleLoginSubmit} />

          <div className={styles.divider}>
            <span>OR</span>
          </div>
        </>
      )}
      <div className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </>
  );
};

export default Login;
