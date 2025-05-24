import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/adminLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(
          "Login failed. Please check your credentials and try again."
        );
        return;
      }

      if (data?.user) {
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          toast.error("You are not authorized as an admin.");
          return;
        }

        toast.success("Welcome, Admin!");
        setTimeout(() => {
          navigate("/admin-page/dashboard");
        }, 2000); // delay
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred during login. Please try again later."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <ToastContainer theme="colored" position="top-center" limit={2} />
      <div className="admin-login-box">
        <h3 className="text-center">Admin Login</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-green w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
