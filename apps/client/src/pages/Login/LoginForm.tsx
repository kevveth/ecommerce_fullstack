import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginInput,
} from "../../../../../packages/shared/dist/esm/schemas";
import styles from "./styles.module.css";

/**
 * Props for the login form component
 * @property {function} submit - Function to handle form submission
 */
interface LoginFormProps {
  submit: (data: LoginInput) => void;
}

/**
 * Login form component with Zod validation
 * @param props - Component props
 * @returns Login form with validation
 */
export function LoginForm({ submit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit", // Only validate on submit, not on blur
    reValidateMode: "onSubmit", // Only re-validate when the user submits again
  });

  const onSubmit: SubmitHandler<LoginInput> = (data) => submit(data);

  return (
    <form
      className={styles.loginFormContainer}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Email */}
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register("email")}
          type="email"
          className={styles.input}
        />
        {isSubmitted && errors.email && (
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
          className={styles.input}
        />
        {isSubmitted && errors.password && (
          <div className={styles.errorField}>{errors.password.message}</div>
        )}
      </div>

      {/* Login Button */}
      <button
        disabled={isSubmitting}
        type="submit"
        className={styles.submitButton}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
