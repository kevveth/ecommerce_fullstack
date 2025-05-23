"use client";

import React from "react";
import { FallbackProps } from "react-error-boundary";
import styles from "./FallbackComponent.module.css"; // We'll create this CSS module next

/**
 * FallbackComponent is displayed when an error is caught by an ErrorBoundary.
 * It provides a user-friendly message and an option to retry the action.
 * @param {Error} error - The error that was caught.
 * @param {() => void} resetErrorBoundary - A function to reset the error boundary and retry rendering.
 */
const FallbackComponent: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div role="alert" className={styles.container}>
      <h2 className={styles.title}>Oops! Something went wrong.</h2>
      <p className={styles.message}>
        We encountered an unexpected error. Please try again.
      </p>
      {error?.message && (
        <pre className={styles.errorMessage}>Error: {error.message}</pre>
      )}
      <button onClick={resetErrorBoundary} className={styles.retryButton}>
        Try Again
      </button>
    </div>
  );
};

export default FallbackComponent;
