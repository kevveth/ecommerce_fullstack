import { Link, useMatch } from "react-router";
import { useAuth } from "../../context/AuthContext";
import styles from "./styles.module.css";
import { useState } from "react";

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log("Navbar - isAuthenticated:", isAuthenticated);
  console.log("Navbar - user:", user);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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

          {/* Only show Profile link if logged in and username is defined */}
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

          {/* Admin can see all profiles */}
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
