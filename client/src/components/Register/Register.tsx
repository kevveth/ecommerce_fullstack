import React, { useState } from "react";
import { PageLayout } from "../PageLayout";
import { RegistrationForm } from "./RegistrationForm";
import { useRegisterUser } from "../../hooks/useRegisterUser";
import styles from "./styles.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useRegisterUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for API call to register user
    mutation.mutate({ username, email, password });
  };

  return (
    <PageLayout>
      {mutation.isPending && (
        <div className={styles.messageBox}>Adding user...</div>
      )}

      <RegistrationForm
        handleSubmit={handleSubmit}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />

      {mutation.isError && (
        <div className={styles.error}>
          An error occurred: {mutation.error.message}
        </div>
      )}

      {mutation.isSuccess && (
        <div className={styles.success}>User {username} added!</div>
      )}
    </PageLayout>
  );
};

export default Register;
