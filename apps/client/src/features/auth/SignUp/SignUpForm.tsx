import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
// import { signUpSchema, type SignUpInput } from "@ecommerce/schemas/better-auth";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  image: z.string().optional(),
  callbackURL: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

type SignUpFormProps = {
  onSubmit: SubmitHandler<SignUpInput>;
};

export function SignUpForm({
  onSubmit = (data) => console.log(data),
}: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name: </label>
          <input {...register("name")} />
          <p>{errors.name && <span>{errors.name.message}</span>}</p>
        </div>

        <div>
          <label htmlFor="email">Email: </label>
          <input type="email" {...register("email")} />
          <p>{errors.email?.message}</p>
        </div>

        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" {...register("password")} />
          <p>{errors.password?.message}</p>
        </div>

        <input type="submit" />
      </form>
    </div>
  );
}
