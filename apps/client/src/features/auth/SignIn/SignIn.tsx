import { useSignIn } from "./useSignIn";
import { SignInForm } from "./SignInForm";
import { SignInInput } from "./SignInForm";
import styles from "./signin.module.css";

export function SignIn() {
  const { error, signIn } = useSignIn();

  const handleSubmit = (formData: SignInInput) => signIn(formData);

  return (
    <div>
      {/* Sign in form  */}
      <SignInForm onSubmit={handleSubmit} />
    </div>
  );
}
