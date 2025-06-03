// import { Link, useMatch } from "react-router";
// import { useAuth } from "../../context/AuthContext";
// import styles from "./styles.module.css";
// import { useState } from "react";

// /**
//  * Renders the navigation bar.
//  * @returns The Navbar component.
//  */
// export function Navbar() {
//   const { user, logout } = useAuth();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Toggle mobile menu open/close
//   const toggleMobileMenu = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   // Close mobile menu (used on link click)
//   const closeMobileMenu = () => {
//     setIsDropdownOpen(false);
//   };

//   // Helper to check if a route is active
//   const isActive = (path: string) => {
//     return !!useMatch(path);
//   };

//   return (
//     <nav className={styles.navbar}>
//       <div className={styles.navContent}>
//         <div className={styles.logoSection}>
//           <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
//             Ken's Coffee Company
//           </Link>
//         </div>

//         <button
//           className={styles.mobileMenuButton}
//           onClick={toggleMobileMenu}
//           aria-label="Toggle navigation menu"
//         >
//           {isDropdownOpen ? "✕" : "☰"}
//         </button>

//         <ul
//           className={`${styles.navList} ${isDropdownOpen ? styles.open : ""}`}
//         >
//           {/* Home is always visible */}
//           <li className={styles.navItem}>
//             <Link
//               to="/"
//               className={`${styles.navLink} ${
//                 isActive("/") ? styles.active : ""
//               }`}
//               onClick={closeMobileMenu}
//             >
//               Home
//             </Link>
//           </li>

//           {/* Profile link: only if authenticated and username exists */}
//           {user?.username && (
//             <li className={styles.navItem}>
//               <Link
//                 to={`/profiles/${user.username}`}
//                 className={`${styles.navLink} ${
//                   isActive(`/profiles/${user.username}`) ? styles.active : ""
//                 }`}
//                 onClick={closeMobileMenu}
//               >
//                 Profile
//               </Link>
//             </li>
//           )}

//           {/* Admin-only: All Profiles link */}
//           {user?.role === "admin" && (
//             <li className={styles.navItem}>
//               <Link
//                 to="/profiles"
//                 className={`${styles.navLink} ${
//                   isActive("/profiles") ? styles.active : ""
//                 }`}
//                 onClick={closeMobileMenu}
//               >
//                 All Profiles
//               </Link>
//             </li>
//           )}

//           {/* Auth button: Login if not authenticated, Logout if authenticated */}
//           <li className={styles.navItem}>
//             {user ? (
//               <button
//                 onClick={() => {
//                   logout();
//                   closeMobileMenu();
//                 }}
//                 className={styles.navLink}
//               >
//                 Logout
//               </button>
//             ) : (
//               <Link
//                 to="/login"
//                 className={`${styles.navLink} ${
//                   isActive("/login") ? styles.active : ""
//                 }`}
//                 onClick={closeMobileMenu}
//               >
//                 Login
//               </Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }
