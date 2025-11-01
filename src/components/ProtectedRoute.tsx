// ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem("adminToken");
    
    if (!adminToken) {
      // Redirect to login if not authenticated
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // Check authentication
  const adminToken = localStorage.getItem("adminToken");
  
  if (!adminToken) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;