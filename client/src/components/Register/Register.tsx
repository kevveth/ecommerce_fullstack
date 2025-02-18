import React, { useState } from "react";
import { PageLayout } from "../PageLayout";
import { FormFields, RegForm } from "./RegistrationForm";
import { useRegisterUser } from "../../hooks/useRegisterUser";
import styles from "./styles.module.css";

const Register = () => {
  const mutation = useRegisterUser();

  const handleSubmit = (data: FormFields) => {
    // Placeholder for API call to register user
    console.log(data);
    
    mutation.mutate(data);
  };

  return (
    <PageLayout>
      {mutation.isPending && (
        <div className={styles.messageBox}>Adding user...</div>
      )}

      <RegForm submit={handleSubmit} />

      {mutation.isError && (
        <div className={styles.error}>
          An error occurred: {mutation.error.message}
        </div>
      )}

      {mutation.isSuccess && (
        <div className={styles.success}>Registration Successful!</div>
      )}
    </PageLayout>
  );
};

export default Register;
