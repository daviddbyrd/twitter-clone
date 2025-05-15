import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth: React.FC<{ children: React.JSX.Element }> = ({
  children,
}) => {
  // Will need to change this to validate the token rather than just looking at isLoggedIn
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // Need to add better spinner for loading here
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
