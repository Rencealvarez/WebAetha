import "../styles/updatepassword.css";
import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const UpdatePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(`❌ ${error.message}`);
      setSuccess(false);
    } else {
      setMessage("✅ Password updated successfully! Redirecting to login...");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000); // redirect after 3 seconds
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3 className="text-center">Set New Password</h3>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 mt-2">
            Update Password
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
