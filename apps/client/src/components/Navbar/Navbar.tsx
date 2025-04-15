import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./styles.module.css";
import { useState } from "react";

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
          <li className={styles.navItem}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                location.pathname === "/" ? styles.active : ""
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
          </li>

          {/* Only show Profile link if logged in */}
          {isAuthenticated && (
            <li className={styles.navItem}>
              <Link
                to="/profile"
                className={`${styles.navLink} ${
                  location.pathname === "/profile" ? styles.active : ""
                }`}
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            </li>
          )}

          {/* Admin can see all profiles */}
          {user?.role === "admin" && (
            <li className={styles.navItem}>
              <Link
                to="/profiles"
                className={`${styles.navLink} ${
                  location.pathname === "/profiles" ? styles.active : ""
                }`}
                onClick={closeMobileMenu}
              >
                All Profiles
              </Link>
            </li>
          )}

          {/* Login/Logout button */}
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
                  location.pathname === "/login" ? styles.active : ""
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
