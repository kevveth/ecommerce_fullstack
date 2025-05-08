import React from "react";
import { Link } from "react-router";
import { RegistrationForm } from "./RegistrationForm";
import { RegistrationStatus } from "./RegistrationStatus";
import { useRegisterUser } from "../../hooks/useRegisterUser";
import styles from "./styles.module.css";
import { type RegistrationInput } from "@ecommerce/shared";

const Register: React.FC = () => {
  const mutation = useRegisterUser();

  const handleRegistrationSubmit = (data: RegistrationInput) => {
    mutation.mutate(data);
  };

  const formattedError = mutation.error
    ? {
        message: mutation.error.message,
        errors: mutation.error.data?.errors,
      }
    : null;

  return (
    <div>
      <h1 className={styles.registerTitle}>Register</h1>
      <RegistrationForm
        submit={handleRegistrationSubmit}
        isMutating={mutation.isPending}
      />
      <RegistrationStatus
        isPending={mutation.isPending}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        error={formattedError}
      />
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
