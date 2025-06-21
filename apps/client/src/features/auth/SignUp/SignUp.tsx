import { SignUpForm, type SignUpInput } from "./SignUpForm";
import { useSignUp } from "./useSignUp";
import styles from "./signup.module.css";

export function SignUp() {
  const { data, error, signUpWithEmail } = useSignUp();

  const handleSubmit = (formData: SignUpInput) => signUpWithEmail(formData);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up</h1>
      <SignUpForm onSubmit={handleSubmit} />
      {error && <p className={styles.errorMessage}>Error: {error.message}</p>}
      {data && (
        <p className={styles.successMessage}>
          Thanks for signing up, {data.user.name}!
        </p>
      )}
    </div>
  );
}
