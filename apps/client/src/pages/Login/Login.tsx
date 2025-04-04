// import { useState } from "react";
import { LoginForm, FormFields } from "./LoginForm";
// import { useNavigate } from 'react-router-dom';

const Login = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const navigate = useNavigate();

  const handleSubmit = (data: FormFields) => {
    console.log(data);
    // navigate('/home');
  };

  return (
    <>
      <h1>Login</h1>
      <LoginForm submit={handleSubmit} />
    </>
  );
};

export default Login;
