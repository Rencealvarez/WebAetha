import "../styles/updatepassword.css";
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/auth-background.css";
import Loader from "../components/Loader";

const UpdatePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const setupSession = async () => {
      try {
        const hash = window.location.hash;
        console.log("URL hash:", hash);

        if (hash) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          console.log("Access token found:", !!accessToken);

          if (accessToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error("Session setup error:", error);
              throw error;
            }
          }
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("Invalid session:", error);
          setMessage(
            "Invalid or expired reset link. Please request a new password reset."
          );
          setTimeout(() => navigate("/request-password-reset"), 3000);
        }
      } catch (error) {
        console.error("Session setup error:", error);
        setMessage(
          "Invalid or expired reset link. Please request a new password reset."
        );
        setTimeout(() => navigate("/request-password-reset"), 3000);
      }
    };

    setupSession();
  }, [navigate]);

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Password should be at least 8 characters long");
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasUppercase && hasLowercase && hasNumber && hasSpecial) {
      score += 4;
    } else {
      feedback.push(
        "Must contain uppercase, lowercase, number, and special character"
      );
    }

    return { score, feedback };
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setSuccess(false);
      setIsLoading(false);
      return;
    }

    if (passwordStrength.score < 5) {
      setMessage("Password is too weak. Please follow the requirements above.");
      setSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: logError } = await supabase.rpc(
        "log_password_reset_attempt",
        {
          p_email: user.email,
          p_ip_address: window.location.hostname,
          p_status: "completed",
          p_user_agent: navigator.userAgent,
        }
      );

      if (logError) {
        console.error("Failed to log password reset completion:", logError);
      }

      await supabase.auth.signOut();

      setMessage("✅ Password updated successfully! Redirecting to login...");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setSuccess(false);
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
        <h3>Set New Password</h3>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-container">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                className="form-control password-input"
                value={newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter a strong password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {newPassword && (
              <div
                className={`password-strength ${
                  passwordStrength.score >= 5 ? "compressed" : ""
                }`}
              >
                <div className="progress">
                  <div
                    className={`progress-bar ${
                      passwordStrength.score >= 5
                        ? "bg-success"
                        : passwordStrength.score >= 3
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                    role="progressbar"
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <small>
                  {passwordStrength.feedback.map((msg, index) => (
                    <div
                      key={index}
                      className={
                        passwordStrength.score >= 5
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {msg}
                    </div>
                  ))}
                </small>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword &&
              newPassword &&
              confirmPassword !== newPassword && (
                <div className="password-validation">
                  <small className="text-danger">Passwords do not match</small>
                </div>
              )}
            {confirmPassword &&
              newPassword &&
              confirmPassword === newPassword && (
                <div className="password-validation">
                  <small className="text-success">✓ Passwords match</small>
                </div>
              )}
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 mt-3"
            disabled={
              isLoading ||
              passwordStrength.score < 5 ||
              newPassword !== confirmPassword
            }
          >
            {isLoading ? (
              <Loader label="Updating" size="sm" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
        {message && (
          <div
            className={`alert mt-3 ${
              success ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
