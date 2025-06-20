import { SignUpForm, type SignUpInput } from "./SignUpForm";
import { useSignUp } from "./useSignUp";

export function SignUp() {
  const { data, error, signUpWithEmail } = useSignUp();

  const handleSubmit = (formData: SignUpInput) => signUpWithEmail(formData);

  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm onSubmit={handleSubmit} />
      {error && <p>Error: {error.message}</p>}
      {data && <p>Thanks for signing up, {data.user.name}!</p>}
    </div>
  );
}
