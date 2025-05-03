import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      // Detect device type
      const userAgent = navigator.userAgent;
      const deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";

      // Insert login record with device info
      await supabase
        .from("logins")
        .insert([{ user_email: email, device_type: deviceType }]);

      alert("Login successful!");
      navigate("/explore");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Link to="/" className="back-link">
          Back
        </Link>
        <h3 className="text-center">Sign In</h3>
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
            <div className="password-container">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Sign In
          </button>
          <p className="text-center mt-3 text-black">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
