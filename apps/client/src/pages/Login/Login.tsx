import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import styles from "./styles.module.css";
import { LoginInput } from "@ecommerce/shared";

const ROUTE_STORAGE_KEY = "last-route";

/**
 * Login page component handles user authentication and redirects
 * appropriately based on authentication status.
 */
const Login = () => {
  const {
    login,
    loginWithGoogle,
    error: authError,
    clearError,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract redirect information from location state
  const fromLocation = location.state?.from;
  const redirectPath =
    fromLocation?.pathname || localStorage.getItem(ROUTE_STORAGE_KEY) || "/";
  const redirectMessage = location.state?.message || null;

  // Set the redirect message if it exists
  useEffect(() => {
    if (redirectMessage) {
      setLoginError(redirectMessage);
    }

    return () => {
      clearError();
    };
  }, [redirectMessage, clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      setLoginError(null);
      setIsSubmitting(true);

      await login(data.email, data.password);

      // The redirect will happen automatically in the effect hook
      // when isAuthenticated becomes true
    } catch (err) {
      // Set login error from auth context or fallback error
      setLoginError(authError || "Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoginError(null);
    loginWithGoogle();
  };

  return (
    <>
      <h1 className={styles.loginTitle}>Login</h1>
      {loginError && <div className="error-message">{loginError}</div>}
      {isSubmitting ? (
        <div className="spinner">Logging in...</div>
      ) : (
        <>
          <LoginForm submit={handleLoginSubmit} />

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.socialLogin}>
            <button className={styles.googleButton} onClick={handleGoogleLogin}>
              Sign in with Google (Mocked)
            </button>
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
