import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/register.css";
import Notification from "../components/Notification";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [notification, setNotification] = useState({ message: "", type: "" });
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

    // Name validation
    if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]*$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Last name validation
    if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]*$/.test(lastName)) {
      newErrors.lastName = "Last name can only contain letters and spaces";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
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
      });

      if (authError) {
        setNotification({ message: authError.message, type: "error" });
        return;
      }

      const user = authData.user;

      if (user) {
        // Insert into your original "users" table
        const { error: dbError1 } = await supabase
          .from("users")
          .insert([{ id: user.id, email, name, last_name: lastName }]);

        // Insert into "user_profiles" table for profile page
        const { error: dbError2 } = await supabase
          .from("user_profiles")
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: name + " " + lastName,
              avatar_url: "",
              bio: "",
            },
          ]);

        if (dbError1 || dbError2) {
          setNotification({
            message:
              dbError1?.message ||
              dbError2?.message ||
              "Something went wrong...",
            type: "error",
          });
          return;
        }

        setNotification({
          message: "Account created successfully! You can now log in.",
          type: "success",
        });
        setTimeout(() => navigate("/login"), 1800);
      }
    } catch (error) {
      setNotification({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      <div className="register-box">
        <Link to="/login" className="back-link">
          ← Back to Login
        </Link>
        <h3 className="text-center">Create Your Account</h3>
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
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
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
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
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
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
