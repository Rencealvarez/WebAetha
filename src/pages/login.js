import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";
import "../styles/auth-background.css";
import Loader from "../components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        setError(error.message);
      } else {
        setError(
          "Confirmation email has been resent. Please check your inbox."
        );
        setShowResendConfirmation(false);
      }
    } catch (err) {
      setError("Failed to resend confirmation email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowResendConfirmation(false);

    // Validate inputs
    if (!validateEmail(email)) {
      setError("Invalid email format. Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting login with email:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Login error details:", error);
        if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address before logging in.");
          setShowResendConfirmation(true);
        } else if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(`Authentication error: ${error.message}`);
        }
        return;
      }

      console.log("Login successful, user data:", data);

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
      console.error("Unexpected login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-background">
        <div className="animated-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>
      <div className="login-box">
        <Link to="/" className="back-link">
          Back
        </Link>
        <h3 className="text-center mb-4">Welcome Back</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            {showResendConfirmation && (
              <div className="mt-2">
                <button
                  className="btn btn-link p-0"
                  onClick={handleResendConfirmation}
                  disabled={isLoading}
                >
                  Resend confirmation email
                </button>
              </div>
            )}
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
                to="/request-password-reset"
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
            {isLoading ? <Loader label="Signing in" size="sm" /> : "Sign In"}
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
