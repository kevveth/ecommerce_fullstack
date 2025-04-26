/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema, LoginInput } from "@repo/shared/schemas";
import styles from "./styles.module.css";

interface LoginProps {
  submit: (data: LoginInput) => void;
}

export function LoginForm({ submit }: LoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInput> = (data) => submit(data);

  return (
    <form
      className={styles.loginFormContainer}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Email */}
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input className={styles.input} {...register("email")} type="email" />
        {errors.email && (
          <div className={styles.errorField}>{errors.email.message}</div>
        )}
      </div>

      {/* Password */}
      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input
          className={styles.input}
          {...register("password")}
          type="password"
        />
        {errors.password && (
          <div className={styles.errorField}>{errors.password.message}</div>
        )}
      </div>

      {/* Login Button  */}
      <button disabled={isSubmitting} type="submit" className="loginButton">
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
