import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

const ProtectedAdmin = ({ children }) => {
  const { isLoggedIn, user, loading } = useAuth();

  // Still checking auth (on refresh)
  if (loading) {
    return <Loader />;
  }

  // Not logged in → go to admin login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin → block
  if (user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdmin;
