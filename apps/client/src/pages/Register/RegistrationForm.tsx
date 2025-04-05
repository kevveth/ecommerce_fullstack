import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./styles.module.css"; // Your CSS Module

// Define schema and type here, where useForm is called
const registrationSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type FormFields = z.infer<typeof registrationSchema>;

// Define props expected from the parent
interface RegFormProps {
  submit: (data: FormFields) => void; // Function to call on valid submit
  isMutating?: boolean; // Is the parent mutation pending?
}

export function RegForm({ submit, isMutating }: RegFormProps) {
  // --- useForm is back inside the form component ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting }, // RHF's state
    // reset, // Get reset if you want to clear form on success (triggered from parent maybe?)
  } = useForm<FormFields>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange", // Keep client-side validation on change
  });

  // This now calls the 'submit' prop passed from Register.tsx
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    submit(data);
    // Note: Can't easily call reset() here based on mutation success
    // without passing more props or state down. Usually reset on success
    // would be handled in the parent component's mutation onSuccess callback if needed.
  };

  // Combine RHF submitting state with parent mutation pending state
  const isCurrentlySubmitting = isFormSubmitting || isMutating;

  return (
    <form
      className={styles.regFormContainer}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Inputs and Client-Side Error Displays */}
      {/* Username */}
      <div className={styles.inputGroup}>
        <label htmlFor="username" style={{ textAlign: "left" }}>
          Username
        </label>
        <input
          id="username"
          {...register("username")}
          type="text"
          // placeholder="Username"
          className={styles.input}
        />
        {errors.username && (
          <div className={styles.errorField}>{errors.username.message}</div>
        )}
      </div>

      {/* Email */}
      <div className={styles.inputGroup}>
        <label htmlFor="username" style={{ textAlign: "left" }}>
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          type="email"
          // placeholder="Email"
          className={styles.input}
        />
        {/* errors.email now ONLY shows client-side format errors */}
        {errors.email && (
          <div className={styles.errorField}>{errors.email.message}</div>
        )}
      </div>

      {/* Password */}
      <div className={styles.inputGroup}>
        <label htmlFor="username" style={{ textAlign: "left" }}>
          Password
        </label>
        <input
          id="password"
          {...register("password")}
          type="password"
          // placeholder="Password"
          className={styles.input}
        />
        {errors.password && (
          <div className={styles.errorField}>{errors.password.message}</div>
        )}
      </div>

      {/* Submit Button */}
      <button
        disabled={isCurrentlySubmitting}
        type="submit"
        className={styles.submitButton}
      >
        {isCurrentlySubmitting ? "Registering..." : "Submit"}
      </button>
    </form>
  );
}
