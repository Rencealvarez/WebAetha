import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/adminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      alert("Admin not found!");
      return;
    }

    if (data.password === password) {
      navigate("/admin");
    } else {
      alert("Invalid admin credentials!");
    }
  };

  return (
    <div className="admin-login-container">
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
            />
          </div>
          <button type="submit" className="btn btn-green w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
