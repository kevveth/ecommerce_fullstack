import React, { useState } from "react";
import { PageLayout } from "../PageLayout";
import { RegistrationForm } from "./RegistrationForm";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { NewUser } from "../../../../server/src/models/user.model";

// interface NewUserProps {
//   username: string;
//   email: string;
//   password: string;
// }

const newUserProps = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
type NewUserSchema = z.infer<typeof newUserProps>;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newUser: NewUserSchema) => {
      const result = newUserProps.safeParse(newUser);
      if (!result.success) {
        throw new Error(result.error.message);
      }

      return fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });
    },
    onError: (error) => {
      console.log("Error registering user:", error);
    },
    onSuccess: (data) => {
      console.log("Registered user:", data);
      // After successful registration, redirect to login page or home page
      // navigate(`/profiles/${username}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for API call to register user
    mutation.mutate({ username, email, password });
  };

  return (
    <PageLayout>
      {mutation.isPending ? (
        "Adding user..."
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>User {username} added!</div> : null}

          <RegistrationForm
            handleSubmit={handleSubmit}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        </>
      )}
    </PageLayout>
  );
};

export default Register;
