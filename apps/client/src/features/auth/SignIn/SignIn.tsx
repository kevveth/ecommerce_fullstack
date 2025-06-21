import { useSignIn } from "./useSignIn";
import { SignInForm } from "./SignInForm";
import { SignInInput } from "./SignInForm";
import styles from "./signin.module.css";

export function SignIn() {
  const { error, signIn } = useSignIn();

  const handleSubmit = (formData: SignInInput) => signIn(formData);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Sign In</p>
      {/* Sign in form  */}
      <SignInForm onSubmit={handleSubmit} />
      {error && <p className={styles.errorMessage}>Error: {error.message}</p>}
    </div>
  );
}
