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
  const navigate = useNavigate();

  useEffect(() => {
    const setupSession = async () => {
      try {
        // Get the access token from the URL hash
        const hash = window.location.hash;
        console.log("URL hash:", hash);

        if (hash) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          console.log("Access token found:", !!accessToken);

          if (accessToken) {
            // Set the session using the access token
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

        // Check if we have a valid session
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

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Password should be at least 8 characters long");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include at least one uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include at least one lowercase letter");
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include at least one number");
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include at least one special character");
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

    if (passwordStrength.score < 3) {
      setMessage("Password is too weak. Please follow the requirements above.");
      setSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // Get current user email for logging
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Log the password change using RPC
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

      // Sign out from all devices
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
        <h3 className="text-center">Set New Password</h3>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Enter new password"
            />
            {newPassword && (
              <div className="password-strength mt-2">
                <div className="progress" style={{ height: "5px" }}>
                  <div
                    className={`progress-bar ${
                      passwordStrength.score >= 4
                        ? "bg-success"
                        : passwordStrength.score >= 3
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                    role="progressbar"
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  {passwordStrength.feedback.map((msg, index) => (
                    <div key={index}>{msg}</div>
                  ))}
                </small>
              </div>
            )}
          </div>
          <div className="form-group mt-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 mt-3"
            disabled={isLoading || passwordStrength.score < 3}
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
