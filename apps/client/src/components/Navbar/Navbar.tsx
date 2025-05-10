import { Link, useMatch } from "react-router";
import { useAuth } from "../../context/AuthContext";
import styles from "./styles.module.css";
import { useState } from "react";

/**
 * Navbar component displays navigation links based on authentication state.
 * - Shows Profile and Logout if authenticated.
 * - Shows Login if not authenticated.
 * - Home and public links are always visible.
 */
export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu open/close
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu (used on link click)
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Helper to check if a route is active
  const isActive = (path: string) => {
    return !!useMatch(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
            Ken's Coffee Company
          </Link>
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <ul
          className={`${styles.navList} ${mobileMenuOpen ? styles.open : ""}`}
        >
          {/* Home is always visible */}
          <li className={styles.navItem}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                isActive("/") ? styles.active : ""
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
          </li>

          {/* Profile link: only if authenticated and username exists */}
          {isAuthenticated && user?.username && (
            <li className={styles.navItem}>
              <Link
                to={`/profiles/${user.username}`}
                className={`${styles.navLink} ${
                  isActive(`/profiles/${user.username}`) ? styles.active : ""
                }`}
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            </li>
          )}

          {/* Admin-only: All Profiles link */}
          {user?.role === "admin" && (
            <li className={styles.navItem}>
              <Link
                to="/profiles"
                className={`${styles.navLink} ${
                  isActive("/profiles") ? styles.active : ""
                }`}
                onClick={closeMobileMenu}
              >
                All Profiles
              </Link>
            </li>
          )}

          {/* Auth button: Login if not authenticated, Logout if authenticated */}
          <li className={styles.navItem}>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className={styles.navLink}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`${styles.navLink} ${
                  isActive("/login") ? styles.active : ""
                }`}
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
