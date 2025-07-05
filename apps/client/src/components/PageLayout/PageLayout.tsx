import { ReactNode } from "react";
import { Outlet } from "react-router";
import styles from "./PageLayout.module.css";
import { NavBar } from "../Navbar/Navbar";
import { NavBar2 } from "../Navbar/Navbar2";

interface PageLayoutProps {
  children?: ReactNode;
  pageTitle?: string;
}

export function PageLayout({ children, pageTitle }: PageLayoutProps) {
  return (
    <div className={styles.pageContainer}>
      <NavBar2 />

      <main className={styles.mainContent}>
        {pageTitle && <h1 className={styles.pageTitle}>{pageTitle}</h1>}
        <div className={styles.contentWrapper}>
          {/* Render either children or the Outlet for nested routes */}
          {children || <Outlet />}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>E-commerce Shop © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
