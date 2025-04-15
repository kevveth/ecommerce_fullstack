import React from "react";
import { Link } from "react-router-dom";

import { RegForm, RegistrationFormFields } from "./RegistrationForm"; // Import RegForm and type
import { useRegisterUser } from "../../hooks/useRegisterUser";
import { RegistrationStatus } from "./RegistrationStatus";
import styles from "./styles.module.css";

const Register: React.FC = () => {
  // Only manages the mutation state
  const mutation = useRegisterUser();

  const handleRegistrationSubmit = (data: RegistrationFormFields) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <h1 className={styles.registerTitle}>Register</h1>
      {/* Pass down the submission handler and mutation pending state */}
      <RegForm
        submit={handleRegistrationSubmit}
        isMutating={mutation.isPending} // Pass mutation pending status
      />
      {/* RegistrationStatus displays result based on mutation state */}
      <RegistrationStatus {...mutation} />

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
