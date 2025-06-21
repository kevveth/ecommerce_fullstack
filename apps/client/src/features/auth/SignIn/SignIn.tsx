import { useSignIn } from "./useSignIn";
import { SignInForm } from "./SignInForm";
import { SignInInput } from "./SignInForm";

export function SignIn() {
  const { error, signIn } = useSignIn();

  const handleSubmit = (formData: SignInInput) => signIn(formData);

  return (
    <>
      <p>Sign In</p>
      {/* Sign in form  */}
      <SignInForm onSubmit={handleSubmit} />
      {error && <p>Error: {error.message}</p>}
    </>
  );
}
