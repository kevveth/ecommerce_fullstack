import { Routes, Route, useLocation } from "react-router-dom";
import App from "../App";
import { Home } from "../pages/Home/home";
// import About from './pages/About';
// import Login from './pages/Login';
// import Register from './pages/Register';
import { Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

const NotFound = () => {
  return (
    <>
      <h1>404</h1>
      <p>The page you are looking for was not found.</p>
      <Link to="/">
        <button>
          Go back to Home
        </button>
      </Link>
    </>
  );
};

export const Router: React.FC = () => {
  const location = useLocation();
  console.log(location); //Log location for debugging

  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to the shop!</h1>} />
      <Route path="home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
