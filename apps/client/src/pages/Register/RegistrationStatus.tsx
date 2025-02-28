import styles from './styles.module.css'

interface StatusProps {
    isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: { message: string } | null; // Define the error type
}


export function RegistrationStatus({ isPending, isError, isSuccess, error}: StatusProps) {
    if (isPending) {
        return <div className={styles.messageBox}>Adding user...</div>;
      }
    
      if (isError) {
        return (
          <div className={styles.error}>An error occurred: {error?.message}</div>
        );
      }
    
      if (isSuccess) {
        return <div className={styles.success}>Registration Successful!</div>;
      }
    
      return null; // Return null if no status to display
}