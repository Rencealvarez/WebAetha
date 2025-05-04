import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../../styles/adminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Add Supabase sign out here if using auth
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2 className="logo">Admin</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin-page/dashboard">📊 Dashboard</Link>
            </li>
            <li>
              <Link to="/admin-page/feedback">💬 Feedback</Link>
            </li>
            <li>
              <Link to="/admin-page/new-users">👥 New Users</Link>
            </li>
            <li>
              <Link to="/admin-page/quiz-stats">🧠 Quiz Stats</Link>
            </li>
            <li>
              <Link to="/admin-page/pending-voices">⏳ Pending Voices</Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
