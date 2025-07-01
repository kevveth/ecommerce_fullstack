import { SignUpForm, type SignUpInput } from "./SignUpForm";
import { useSignUp } from "./useSignUp";

export function SignUp() {
  const { data, error, signUpWithEmail } = useSignUp();

  const handleSubmit = (formData: SignUpInput) => signUpWithEmail(formData);

  return (
    <div>
      <SignUpForm onSubmit={handleSubmit} />
    </div>
  );
}
