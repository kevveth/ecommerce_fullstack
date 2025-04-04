/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";

const schema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8),
});

export type FormFields = z.infer<typeof schema>;

interface RegFormProps {
  submit: (data: FormFields) => void;
}

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
        <div className={styles.error}>{errors.username.message}</div>
      )}
      <input {...register("email")} type="email" placeholder="Email" />
      {errors.email && (
        <div className={styles.error}>{errors.email.message}</div>
      )}
      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && (
        <div className={styles.error}>{errors.password.message}</div>
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
