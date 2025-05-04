import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/AuthContext";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Authentication failed: No token received");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    const processAuth = async () => {
      try {
        await handleAuthCallback(token);
        // Redirect to home page after successful authentication
        navigate("/");
      } catch (err) {
        setError("Failed to process authentication");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    processAuth();
  }, [searchParams, handleAuthCallback, navigate]);

  if (error) {
    return (
      <div className="auth-callback-container">
        <div className="error-message">{error}</div>
        <div>Redirecting to login page...</div>
      </div>
    );
  }

  return (
    <div className="auth-callback-container">
      <div className="loading-message">Processing your sign-in...</div>
    </div>
  );
};

export default AuthCallback;
