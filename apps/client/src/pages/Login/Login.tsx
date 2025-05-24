import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import styles from "./styles.module.css";
import { LoginInput } from "@ecommerce/shared/schemas";
import { LoginForm } from "./LoginForm";

const ROUTE_STORAGE_KEY = "last-route";

/**
 * Login page component handles user authentication and redirects
 * appropriately based on authentication status.
 */
const Login = () => {
  // Use loginError and isLoggingIn from useAuth()
  const { login, loginError, isAuthenticated, isLoggingIn, clearLoginError } =
    useAuth();
  const location = useLocation();

  const fromLocation = location.state?.from;
  const redirectPath =
    fromLocation?.pathname || localStorage.getItem(ROUTE_STORAGE_KEY) || "/";
  const redirectMessage = location.state?.message || null;

  // Declarative redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleLoginSubmit = async (data: LoginInput) => {
    // Clear any previous login errors before a new attempt
    if (loginError) {
      clearLoginError();
    }
    try {
      await login(data);
      // On successful login, AuthContext's onSuccess navigates.
      // No need to setIsSubmitting(true/false) as isLoggingIn from context handles this.
    } catch (err) {
      // Errors are set in AuthContext by the loginMutation's onError handler.
      // The loginError from useAuth() will be updated and displayed.
      // The console.error here is redundant if AuthContext already logs it.
      // console.error("Login attempt failed in Login.tsx catch block:", err);
    }
  };

  return (
    <>
      <h1 className={styles.loginTitle}>Login</h1>
      {/* Display redirectMessage if it exists */}
      {redirectMessage && <div className="info-message">{redirectMessage}</div>}
      {/* Display loginError from context */}
      {loginError && <div className="error-message">{loginError}</div>}
      {isLoggingIn ? (
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
