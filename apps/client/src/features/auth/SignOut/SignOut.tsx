import { authClient } from "@/utils/auth-client";
import { useMutation } from "@tanstack/react-query";
import { ReactEventHandler } from "react";
import { useNavigate } from "react-router";

export function SignOut() {
  const navigate = useNavigate();

  const {
    mutate: signOut,
    error,
    isPending,
  } = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleClick: ReactEventHandler = (event) => {
    event.preventDefault();
    signOut();
  };

  return (
    <>
      <button title="sign-out" onClick={handleClick} disabled={isPending}>
        Sign Out
      </button>
      {error && <p>{error.message}</p>}
    </>
  );
}
