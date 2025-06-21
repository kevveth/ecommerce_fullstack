import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
      </div>

      <div className="form-group checkbox">
        <input
          id="rememberMe"
          type="checkbox"
          {...register("rememberMe")}
          disabled={isSubmitting}
        />
        <label htmlFor="rememberMe">Remember me</label>
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
