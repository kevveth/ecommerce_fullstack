import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationInput } from "@ecommerce/shared";
import styles from "./styles.module.css";

// Define props expected from the parent
interface RegistrationFormProps {
  submit: (data: RegistrationInput) => void;
  isMutating?: boolean; // Is the parent mutation pending?
}

export function RegistrationForm({
  submit,
  isMutating,
}: RegistrationFormProps) {
  // --- useForm is back inside the form component ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting }, // RHF's state
    // reset, // Get reset if you want to clear form on success (triggered from parent maybe?)
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange", // Keep client-side validation on change
  });

  // This now calls the 'submit' prop passed from Register.tsx
  const onSubmit: SubmitHandler<RegistrationInput> = (data) => {
    submit(data);
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
      {/* Username */}
      <div className={styles.inputGroup}>
        <label htmlFor="username">Username</label>
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
        <label htmlFor="email">Email</label>
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
        <label htmlFor="password">Password</label>
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
