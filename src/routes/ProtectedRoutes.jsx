
// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isSubscribed } = useAuth();

  if (!user) {
    // المستخدم غير مسجل الدخول
    return <Navigate to="/" replace />;
  }

  // إذا كان له دور غير مسموح له بالدخول
  if (allowedRoles && !allowedRoles.includes(user.role) && isSubscribed) {
    // حدد المسار المناسب بناءً على دور المستخدم
    const roleToDashboardPath = {
      company: "/dashboard",
      supervisor: "/dashboard-supervisor",
      employee: "/dashboard-employee",
      // Marketer: "/dashboard-Marketer",
    };

    const targetPath = roleToDashboardPath[user.role] || "/dashboard";
    return <Navigate to={targetPath} replace />;
  }

  // المستخدم مسموح له بالوصول
  return children;
};

export default ProtectedRoute;