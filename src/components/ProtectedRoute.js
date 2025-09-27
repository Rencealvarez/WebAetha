import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <Loader label="Checking session" fullscreen size="md" />;
  if (!session) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
