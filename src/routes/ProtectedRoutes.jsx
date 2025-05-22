import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user ,isSubscribed } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // if (allowedRoles && !allowedRoles.includes(user.role) && isSubscribed) {
  //   return (
  //     <>
  //       <Navigate
  //         to={`/dashboard${
  //           user.role === "company"
  //             ? ""
  //             : user.role === "supervisor"
  //             ? "-supervisor"
  //             : "-employee"
  //         }`}
  //         replace
  //       />
  //       ;
  //     </>
  //   ); // Redirect if the user doesn't have the required role
  //}

  return children;
};

export default ProtectedRoute;
