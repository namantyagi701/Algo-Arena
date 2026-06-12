import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

function AdminRoute({ children }) {
  const { isSignedIn, isAdmin, isLoaded } = useAuth();
  const toastShown = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !isAdmin && !toastShown.current) {
      toast.error("Access denied — admin only");
      toastShown.current = true;
    }
  }, [isLoaded, isSignedIn, isAdmin]);

  if (!isLoaded) return null;

  if (!isSignedIn) return <Navigate to="/login" replace />;

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

export default AdminRoute;
