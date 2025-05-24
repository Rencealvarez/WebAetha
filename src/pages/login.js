import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate inputs
    if (!validateEmail(email)) {
      setError("Invalid email format. Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific authentication errors
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address before logging in.");
        } else {
          setError(error.message);
        }
        return;
      }

      // Detect device type
      const userAgent = navigator.userAgent;
      const deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";

      // Insert login record with timestamp
      const { error: insertErr } = await supabase.from("logins").insert([
        {
          user_email: email,
          device_type: deviceType,
          logged_in_at: new Date().toISOString(),
        },
      ]);

      if (insertErr) {
        console.error("Error recording login:", insertErr);
      }

      // Store user_id for profile use
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (userId) {
        localStorage.setItem("user_id", userId);
      }

      navigate("/explore");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Link to="/" className="back-link">
          Back
        </Link>
        <h3 className="text-center mb-4">Welcome Back</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Password</label>
            <div className="password-container">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <div className="d-flex justify-content-end mt-2">
              <Link
                to="/update-password"
                className="text-green text-decoration-none"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          <p className="text-center mt-3 text-black">
            Don't have an account?{" "}
            <Link to="/register" className="text-green text-decoration-none">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
