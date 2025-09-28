import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/register.css";
import "../styles/auth-background.css";
import Notification from "../components/Notification";
import Loader from "../components/Loader";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(
        () => setNotification({ message: "", type: "" }),
        2500
      );
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const getPasswordStrengthColor = () => {
    const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"];
    return colors[passwordStrength - 1] || "#ecf0f1";
  };

  const validateInputs = () => {
    const newErrors = {};

    if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]*$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]*$/.test(lastName)) {
      newErrors.lastName = "Last name can only contain letters and spaces";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (authError) {
        console.error("Signup error:", authError);
        let errorMessage = "Failed to create account. Please try again.";

        if (authError.message.includes("already registered")) {
          errorMessage =
            "This email is already registered. Please use a different email or try logging in.";
        } else if (authError.message.includes("password")) {
          errorMessage =
            "Password is too weak. Please use a stronger password.";
        }

        setNotification({
          message: errorMessage,
          type: "error",
        });
        return;
      }

      const user = authData?.user;

      if (!user) {
        setNotification({
          message: "Failed to create account. Please try again.",
          type: "error",
        });
        return;
      }

      const { error: dbError } = await supabase.from("user_profiles").insert([
        {
          id: user.id,
          email: user.email,
          full_name: name + " " + lastName,
          avatar_url: "",
          bio: "",
        },
      ]);

      if (dbError) {
        console.error("Database error:", dbError);
        setNotification({
          message:
            "Account created but profile setup failed. Please contact support.",
          type: "error",
        });
        return;
      }

      setConfirmationSent(true);
      setNotification({
        message:
          "Registration successful! Please check your email to confirm your account.",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 5000);
    } catch (error) {
      console.error("Registration error:", error);
      setNotification({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="auth-background">
        <div className="animated-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      <div className="register-box">
        <Link to="/login" className="back-link">
          Back to Login
        </Link>
        <h3 className="text-center">Create Your Account</h3>
        {confirmationSent ? (
          <div className="alert alert-success">
            <h4>Registration Successful!</h4>
            <p>
              Please check your email to confirm your account. You will be
              redirected to the login page in a few seconds.
            </p>
            <p>If you don't see the email, please check your spam folder.</p>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className={`form-control ${
                  errors.lastName ? "is-invalid" : ""
                }`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
              <div className="password-strength">
                <div
                  className="password-strength-bar"
                  style={{
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(),
                  }}
                />
              </div>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader label="Creating Account" size="sm" />
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
