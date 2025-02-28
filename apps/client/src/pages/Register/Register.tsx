// components/Register/Register.tsx (assuming file location)
import React from 'react'; // Import React
import { RegForm, FormFields } from './RegistrationForm'; // Import types
// import { useRegisterUser } from "../../hooks/useRegisterUser"; // Uncomment when ready
// import styles from './styles.module.css';
import { RegistrationStatus } from './RegistrationStatus';

const Register: React.FC = () => {  // Use React.FC for type safety
  // const mutation = useRegisterUser(); // Uncomment when ready
    const mutation = { //Mock mutation object
    isPending: false,
    isSuccess: false,
    isError: false,
    error: { message: 'Error!' }
  };

  const handleSubmit = (data: FormFields) => {
    // mutation.mutate(data); // Uncomment when ready
    console.log(data);
  };

  return (
    <div> 
        <RegForm submit={handleSubmit} />
        <RegistrationStatus {...mutation} />
    </div>
  );
};

export default Register;