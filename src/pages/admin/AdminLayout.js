import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import "../../styles/adminLayout.css";
import LogoutConfirmation from "../../components/LogoutConfirmation";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
              <Link to="/admin-page/content">🖼️ Content Management</Link>
            </li>
            <li>
              <Link to="/admin-page/museum-content">🏛️ Museum Content</Link>
            </li>
            <li>
              <button
                className="logout-btn"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
      <LogoutConfirmation
        show={showLogoutConfirm}
        onHide={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AdminLayout;
