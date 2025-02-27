import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type FormFields = z.infer<typeof schema>;

type LoginProps = {
  submit: (data: FormFields) => void;
};

export function LoginForm({ submit }: LoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = submit;

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "1rem",
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <input {...register("email")} type="email" placeholder="Email" />
      {errors.email && (
        <div style={{ color: "red", fontSize: "0.8em" }}>
          {errors.email.message}
        </div>
      )}

      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && (
        <div style={{ color: "red", fontSize: "0.8em" }}>
          {errors.password.message}
        </div>
      )}

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
