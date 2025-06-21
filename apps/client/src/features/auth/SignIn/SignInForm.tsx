import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.css";

const signInSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    error: "Password must be at least 6 characters long",
  }),
  rememberMe: z.boolean(),
});

export type SignInInput = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onSubmit: SubmitHandler<SignInInput>;
}

export function SignInForm({ onSubmit }: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          className={styles.input}
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className={styles.errorMessage}>{errors.email.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          className={styles.input}
          {...register("password")}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
      </div>

      <div className={styles.checkboxGroup}>
        <input
          id="rememberMe"
          type="checkbox"
          className={styles.checkbox}
          {...register("rememberMe")}
          disabled={isSubmitting}
        />
        <label htmlFor="rememberMe" className={styles.checkboxLabel}>
          Remember me
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
