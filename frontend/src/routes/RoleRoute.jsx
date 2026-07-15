import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RoleRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    if (user.role === "PURCHASE_MANAGER") {
      return <Navigate to="/purchase/dashboard" replace />;
    }

    return <Navigate to="/resident/dashboard" replace />;
  }

  return children;
}