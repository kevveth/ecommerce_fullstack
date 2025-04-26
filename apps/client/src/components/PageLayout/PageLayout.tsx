import { ReactNode } from "react";
import { Outlet } from "react-router";
import { Navbar } from "../Navbar/Navbar";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children?: ReactNode;
  pageTitle?: string;
}

export default function PageLayout({ children, pageTitle }: PageLayoutProps) {
  return (
    <div className={styles.pageContainer}>
      <Navbar />

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
