import { SignUpForm } from "./SignUpForm";
import { useSignUp } from "./useSignUp";

export function SignUp() {
  const { data, signUpWithEmail } = useSignUp();

  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm onSubmit={signUpWithEmail} />
      {data && <p>Thanks for signing up, {data.user.name}!</p>}
    </div>
  );
}
