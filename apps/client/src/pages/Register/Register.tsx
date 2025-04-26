import React from "react";
import { Link } from "react-router";

import { RegForm } from "./RegistrationForm";
import { useRegisterUser } from "../../hooks/useRegisterUser";
import { RegistrationStatus } from "./RegistrationStatus";
import { RegistrationInput } from "@repo/shared/schemas";
import styles from "./styles.module.css";

const Register: React.FC = () => {
  // Use the updated mutation with improved error handling
  const mutation = useRegisterUser();

  const handleRegistrationSubmit = (data: RegistrationInput) => {
    mutation.mutate(data);
  };

  // Create a formatted error object for RegistrationStatus
  const formattedError = mutation.error
    ? {
        message: mutation.error.message,
        errors: mutation.error.data?.errors,
      }
    : null;

  return (
    <div>
      <h1 className={styles.registerTitle}>Register</h1>
      {/* Pass down the submission handler and mutation pending state */}
      <RegForm
        submit={handleRegistrationSubmit}
        isMutating={mutation.isPending}
      />
      {/* Pass the formatted error to RegistrationStatus */}
      <RegistrationStatus
        isPending={mutation.isPending}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        error={formattedError}
      />

      {/* Login Link */}
      <div className={styles.loginPrompt}>
        <p>
          <Link to="/login" className={styles.loginLink}>
            Already signed up? Log in here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
