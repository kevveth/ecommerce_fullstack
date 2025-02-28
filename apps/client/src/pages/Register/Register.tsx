// components/Register/Register.tsx (assuming file location)
import React from 'react'; // Import React
import { RegForm, FormFields } from './RegistrationForm'; // Import types
// import { useRegisterUser } from "../../hooks/useRegisterUser"; // Uncomment when ready
import styles from './styles.module.css';

const Register: React.FC = () => {  // Use React.FC for type safety
  // const mutation = useRegisterUser(); // Uncomment when ready
    const mutation = { //Mock mutation object
    isPending: false,
    isError: true,
    isSuccess: false,
    error: { message: 'Error!' }
  };

  const handleSubmit = (data: FormFields) => {
    // mutation.mutate(data); // Uncomment when ready
    console.log(data);
  };

  return (
    <div> 
      {mutation.isPending && (<div className={styles.messageBox}>Adding user...</div>)}

      {mutation.isError && (<div className={styles.error}>
        An error occurred: {mutation.error?.message}
      </div>)}

      {mutation.isSuccess && (
        <div className={styles.success}>Registration Successful!</div>
      )}
        <RegForm submit={handleSubmit} />
    </div>
  );
};

export default Register;