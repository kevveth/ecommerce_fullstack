import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "../pages/Home";
// import About from './pages/About';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Register from "./Register";
import Login from "./Login";
import { NotFound } from "../errors/NotFound";


export const Router: React.FC = () => {
  const location = useLocation();
  console.log(location); //Log location for debugging

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
