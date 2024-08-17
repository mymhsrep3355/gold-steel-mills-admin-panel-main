
import { Navigate } from "react-router-dom";
import { useAuthProvider } from "../hooks/useAuthProvider";


const PrivateRoute = ({ children }) => {
  const { token } = useAuthProvider();

  if (!token) {
    return <Navigate to="/auth/login" />;
  }
  return children;
};

export default PrivateRoute;
