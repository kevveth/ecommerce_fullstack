import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
import { z } from "zod";

const newUserProps = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
type NewUserSchema = z.infer<typeof newUserProps>;

export function useRegisterUser() {
  return useMutation({
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
    },
  });
}
