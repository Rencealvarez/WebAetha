import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    const { count: userCount, error: userError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: loginCount, error: loginError } = await supabase
      .from("logins")
      .select("*", { count: "exact", head: true });

    console.log("User count:", userCount, "Error:", userError);
    console.log("Login count:", loginCount, "Error:", loginError);

    setUserCount(userCount || 0);
    setVisitorCount(loginCount || 0);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <h3 className="admin-title">AETHA</h3>
        <span className="admin-welcome">Welcome Admin</span>
        <button className="btn btn-success logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="analytics-section">
        <h2 className="analytics-title">Analytics</h2>
        <div className="analytics-boxes">
          <div className="analytics-card">
            <span className="analytics-icon">👤</span>
            <p className="analytics-label">Registered Users</p>
            <h3>{userCount}</h3>
          </div>
          <div className="analytics-card">
            <span className="analytics-icon">🌐</span>
            <p className="analytics-label">Total Visits</p>
            <h3>{visitorCount}</h3>
          </div>
        </div>
      </div>

      <footer className="admin-footer">
        <h3>Connect with Us</h3>
        <p>123, Dasmariñas City, Cavite</p>
        <p>0929222145</p>
        <p>contact@TAPDEV.org</p>
      </footer>
    </div>
  );
};

export default Admin;
