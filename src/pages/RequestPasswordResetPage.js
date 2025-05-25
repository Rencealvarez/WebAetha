import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/updatepassword.css";

const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
  const [lockoutEndTime, setLockoutEndTime] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();

    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      const remainingMinutes = Math.ceil((lockoutEndTime - Date.now()) / 60000);
      setMessage(
        `Too many attempts. Please try again in ${remainingMinutes} minutes.`
      );
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Configure the redirect URL based on environment
      const baseUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:3000"
          : window.location.origin;

      const redirectTo = `${baseUrl}/update-password`;

      console.log("Sending password reset email to:", email);
      console.log("Redirect URL:", redirectTo);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        console.error("Password reset error:", error);
        throw error;
      }

      // Always show the same message for security
      setMessage(
        "If an account exists with this email, you will receive password reset instructions. Please check your inbox."
      );

      // Log the reset attempt using RPC to handle authentication
      const { error: logError } = await supabase.rpc(
        "log_password_reset_attempt",
        {
          p_email: email,
          p_ip_address: window.location.hostname,
          p_status: "requested",
          p_user_agent: navigator.userAgent,
        }
      );

      if (logError) {
        console.error("Failed to log password reset attempt:", logError);
      }
    } catch (error) {
      // Only show a generic error for server issues
      setMessage(
        "Something went wrong. Please try again later or contact support."
      );
      setAttempts((prev) => prev + 1);

      if (attempts + 1 >= MAX_ATTEMPTS) {
        setLockoutEndTime(Date.now() + LOCKOUT_TIME);
      }
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Link to="/login" className="back-link">
          Back to Login
        </Link>
        <h3 className="text-center">Reset Password</h3>
        <form onSubmit={handleResetRequest}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="Enter your registered email"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 mt-2"
            disabled={!isValidEmail || isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
        </form>
        {message && (
          <div
            className={`alert mt-3 ${
              message.includes("sent") ? "alert-success" : "alert-info"
            }`}
          >
            {message}
          </div>
        )}
        <div className="mt-3 text-center">
          <small className="text-muted">
            For security reasons, reset links expire in 1 hour.
            <br />
            If you need assistance, please contact support.
          </small>
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;
