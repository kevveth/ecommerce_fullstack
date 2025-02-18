/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8),
});

export type FormFields = z.infer<typeof schema>;

type RegFormProps = {
  submit: (data: FormFields) => void;
};

export function RegForm({ submit }: RegFormProps) {
  const {
    register,
    handleSubmit,
    // setError,
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
      <input {...register("username")} type="text" placeholder="Username" />
      {errors.username && (
        <div style={{ color: "red", fontSize: "0.8em" }}>
          {errors.username.message}
        </div>
      )}
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
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
      {/* {errors.root && (
        <div style={{ color: "red", fontSize: "0.8em" }}>
          {errors.root.message}
        </div>
      )} */}
    </form>
  );
}
