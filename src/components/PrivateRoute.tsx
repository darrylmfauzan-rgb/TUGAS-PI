import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AUTH_USER_KEY = "auth-user";

const isCustomerLoggedIn = () => {
  if (typeof window === "undefined") return false;
  const session = sessionStorage.getItem(AUTH_USER_KEY);
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    return Boolean(parsed?.email && parsed?.name);
  } catch {
    return false;
  }
};

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  if (!isCustomerLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
