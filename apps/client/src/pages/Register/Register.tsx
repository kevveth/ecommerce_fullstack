import React from "react";
import { RegForm, FormFields } from "./RegistrationForm"; // Import types
import { useRegisterUser } from "../../hooks/useRegisterUser";
// import styles from './styles.module.css';
import { RegistrationStatus } from "./RegistrationStatus";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Register: React.FC = () => {
  const mutation = useRegisterUser();
  // const mutation = {
  //   //Mock mutation object
  //   isPending: false,
  //   isSuccess: false,
  //   isError: false,
  //   error: { message: "Error!" },
  // };

  const handleSubmit = (data: FormFields) => {
    mutation.mutate(data);
    // console.log(data);
  };

  return (
    <div>
      <h1>Register</h1>
      <RegForm submit={handleSubmit} />
      <RegistrationStatus {...mutation} />

      <div className={styles.loginPrompt}>
        <h5>
          <Link to="/login" className={styles.loginLink}>
            Already signed up? Log in here!
          </Link>
        </h5>
      </div>
    </div>
  );
};

export default Register;
