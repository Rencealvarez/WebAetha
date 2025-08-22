import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/updatepassword.css";
import "../styles/auth-background.css";

const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showResendPrompt, setShowResendPrompt] = useState(false);
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
  const RESEND_COOLDOWN = 60; // 60 seconds cooldown
  const MESSAGE_DISPLAY_TIME = 5000; // 5 seconds
  const [lockoutEndTime, setLockoutEndTime] = useState(null);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            setShowResendPrompt(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    let messageTimer;
    if (message) {
      setShowMessage(true);
      messageTimer = setTimeout(() => {
        setShowMessage(false);
      }, MESSAGE_DISPLAY_TIME);
    }
    return () => clearTimeout(messageTimer);
  }, [message]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

    if (!canResend) {
      setMessage(
        `Please wait ${resendTimer} seconds before requesting another reset.`
      );
      return;
    }

    setIsLoading(true);
    setMessage("");
    setCanResend(false);
    setResendTimer(RESEND_COOLDOWN);
    setShowResendPrompt(false);

    try {
      const baseUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:3000"
          : window.location.origin;

      const redirectTo = `${baseUrl}/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        throw error;
      }

      setMessage(
        "You will receive password reset instructions. Please check your inbox."
      );

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
      setMessage(
        "Something went wrong. Please try again later or contact support."
      );
      setAttempts((prev) => prev + 1);

      if (attempts + 1 >= MAX_ATTEMPTS) {
        setLockoutEndTime(Date.now() + LOCKOUT_TIME);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (canResend) {
      await handleResetRequest({ preventDefault: () => {} });
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
        <Link to="/login" className="back-link">
          <i className="fas fa-arrow-left me-2"></i>Back to Login
        </Link>
        <h3 className="text-center mb-4">Reset Password</h3>
        <form onSubmit={handleResetRequest}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="Enter your registered email"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={!isValidEmail || isLoading || !canResend}
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
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Send Reset Instructions
              </>
            )}
          </button>
        </form>
        {message && (
          <div
            className={`alert mt-3 message-fade ${
              showMessage ? "show" : "hide"
            } ${message.includes("sent") ? "alert-success" : "alert-info"}`}
          >
            <i
              className={`fas ${
                message.includes("sent") ? "fa-check-circle" : "fa-info-circle"
              } me-2`}
            ></i>
            {message}
          </div>
        )}
        {!canResend && resendTimer > 0 ? (
          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="fas fa-clock me-1"></i>
              Resend available in {formatTime(resendTimer)}
            </small>
          </div>
        ) : (
          showResendPrompt && (
            <div className="text-center mt-3">
              <div className="alert alert-info message-fade show">
                <i className="fas fa-envelope me-2"></i>
                Want to resend the instructions?
              </div>
              <button
                onClick={handleResend}
                className="btn btn-link text-decoration-none"
              >
                <i className="fas fa-redo me-1"></i>
                Resend Instructions
              </button>
            </div>
          )
        )}
        <div className="mt-4 text-center">
          <small className="text-muted">
            <i className="fas fa-shield-alt me-1"></i>
            For security reasons, reset links expire in 1 hour.
            <br />
            <i className="fas fa-question-circle me-1"></i>
            Need assistance? Contact support.
          </small>
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;
