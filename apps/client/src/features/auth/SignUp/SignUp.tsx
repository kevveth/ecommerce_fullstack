import { SignUpForm } from "./SignUpForm";
import { useSignUp } from "./useSignUp";

export function SignUp() {
  const { data, formError, signUpWithEmail } = useSignUp();

  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm onSubmit={signUpWithEmail} />
      {formError && <p>Error: {formError}</p>}
      {data && <p>Thanks for signing up, {data.user.name}!</p>}
    </div>
  );
}
