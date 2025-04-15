import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Show these links only when user is not authenticated */}
        {!isAuthenticated && (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}

        {/* Show these links only when user is authenticated */}
        {isAuthenticated && (
          <>
            <li>
              <Link to="/profiles">Profiles</Link>
            </li>
            {user && (
              <li>
                <Link to={`/profiles/${user.username ?? user.user_id}`}>
                  My Profile
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
