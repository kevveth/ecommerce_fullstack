import styles from "./styles.module.css";
import { ZodIssue } from "zod";

// More detailed error interface that matches our improved API error responses
interface ValidationError {
  message: string;
  errors?: {
    [key: string]: {
      _errors: string[];
    };
  };
}

interface StatusProps {
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: ValidationError | null;
}

export function RegistrationStatus({
  isPending,
  isError,
  isSuccess,
  error,
}: StatusProps) {
  if (isPending) {
    return <div className={styles.messageBox}>Adding user...</div>;
  }

  if (isError && error) {
    return (
      <div className={styles.errorStatus}>
        <div className={styles.errorTitle}>{error.message}</div>

        {/* Display field-specific validation errors if they exist */}
        {error.errors && (
          <ul className={styles.errorList}>
            {Object.entries(error.errors).map(([field, errorInfo]) =>
              errorInfo._errors.map((msg, idx) => (
                <li key={`${field}-${idx}`} className={styles.errorItem}>
                  <strong>{field}:</strong> {msg}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={styles.success}>
        Registration Successful! You can now log in.
      </div>
    );
  }

  return null; // Return null if no status to display
}
