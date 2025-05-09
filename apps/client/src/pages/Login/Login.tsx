import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import styles from "./styles.module.css";
import { LoginInput } from "@ecommerce/shared";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      setLoginError(null);
      setIsLoading(true);

      await login(data.email, data.password);

      // Redirect to the page user was trying to visit before being sent to login
      // Or default to home page if they went directly to login
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      // The error is already set in the auth context
      setLoginError(authError || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
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
      {isLoading ? (
        <div className="spinner">Loading...</div>
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
