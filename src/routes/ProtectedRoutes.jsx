import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isSubscribed } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // null = loading

  useEffect(() => {
    const check = async () => {
      if (user) {
        // فقط company و marketer يحتاجوا تحقق من الاشتراك
        if (["company", "marketer"].includes(user.role)) {
          const result = await isSubscribed();
          setSubscriptionStatus(result);
        } else {
          // supervisor و employee: يعتبروا "مشتركين" تلقائيًا (no subscription needed)
          setSubscriptionStatus(true);
        }
      } else {
        setSubscriptionStatus(false);
      }
    };
    check();
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (subscriptionStatus === null) {
    return <div>Loading...</div>; // أو spinner
  }

  // ✅ فقط إذا كان الدور يتطلب اشتراكًا وليست مشتركًا
  if (["company", "marketer"].includes(user.role) && !subscriptionStatus) {
    return <Navigate to="/subscription-plans" replace />;
  }

  // ✅ إذا الدور غير مسموح له بالوصول
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleToDashboardPath = {
      company: "/dashboard",
      marketer: "/dashboard-Marketer",
      supervisor: "/dashboard-supervisor",
      employee: "/dashboard-employee",
    };
    const targetPath = roleToDashboardPath[user.role] || "/dashboard";
    return <Navigate to={targetPath} replace />;
  }

  return children;
};
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, isSubscribed } = useAuth();
//   const [subscriptionStatus, setSubscriptionStatus] = useState(null); // null = loading

//   useEffect(() => {
//     const check = async () => {
//       if (user) {
//         const result = await isSubscribed(); // ✅ تنفذ الدالة هنا
        
//         setSubscriptionStatus(result);
//         console.log("✅ isSubscribed result:", result);
//       } else {
//         setSubscriptionStatus(false);
//       }
//     };

//     check();
//   }, [user]);

//   if (!user) {
//     return <Navigate to="/" replace />;
//   }

//   if (subscriptionStatus === null) {
//     return <div>Loading subscription status...</div>; // أو Spinner من Mantine
//   }

//   // ✅ إذا لم يكن مشتركًا، نحوله لصفحة الاشتراكات
//   if (!subscriptionStatus) {
//     return <Navigate to="/subscription-plans" replace />;
//   }

//   // ✅ إذا دوره غير مسموح
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     const roleToDashboardPath = {
//       company: "/dashboard",
//       marketer: "/dashboard-Marketer",
//       supervisor: "/dashboard-supervisor",
//       employee: "/dashboard-employee",
//     };

//     const targetPath = roleToDashboardPath[user.role] || "/dashboard";
//     return <Navigate to={targetPath} replace />;
//   }

//   return children;
// };

export default ProtectedRoute;

// // ProtectedRoute.jsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/authContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, isSubscribed } = useAuth();
// console.log(user, "user in protected route");
// console.log(isSubscribed, "isSubscribed in protected route");

//   if (!user) {
//     // المستخدم غير مسجل الدخول
//     return <Navigate to="/" replace />;
//   }

//   // إذا كان له دور غير مسموح له بالدخول
//   if (allowedRoles && !allowedRoles.includes(user.role) && isSubscribed) {
//     // حدد المسار المناسب بناءً على دور المستخدم
//     const roleToDashboardPath = {
//       company: "/dashboard",
//       marketer: "/dashboard-Marketer",
//       supervisor: "/dashboard-supervisor",
//       employee: "/dashboard-employee",
//     };

//     const targetPath = roleToDashboardPath[user.role] || "/dashboard";
//     return <Navigate to={targetPath} replace />;
//   }

//   // المستخدم مسموح له بالوصول
//   return children;
// };

// export default ProtectedRoute;
