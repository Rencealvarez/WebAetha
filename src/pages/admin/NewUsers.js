import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { FaUserCircle, FaTrash, FaBan, FaCopy, FaCheck } from "react-icons/fa";
import "../../styles/NewUsers.css";

const NewUsers = () => {
  const [newUsers, setNewUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch users
      const { data: users, error: usersError } = await supabase
        .from("user_profiles")
        .select("*")
        .limit(10);
      if (usersError) throw usersError;
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("*");
      if (profilesError) throw profilesError;
      // Merge users with profiles by id
      const merged = (users || []).map((user) => {
        const profile = (profiles || []).find((p) => p.id === user.id);
        return {
          ...user,
          avatar_url: profile ? profile.avatar_url : null,
        };
      });
      setNewUsers(merged);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching new users:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDelete = async (user) => {
    try {
      const { error } = await supabase.from("users").delete().eq("id", user.id);

      if (error) throw error;

      setNewUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error("Error deleting user:", err.message);
    }
  };

  const handleSuspend = async (user) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          status: user.status === "suspended" ? "active" : "suspended",
        })
        .eq("id", user.id);

      if (error) throw error;

      setNewUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id
            ? {
                ...u,
                status: u.status === "suspended" ? "active" : "suspended",
              }
            : u
        )
      );
    } catch (err) {
      console.error("Error suspending user:", err.message);
    }
  };

  if (error) {
    return (
      <div className="new-users">
        <h2>Newly Registered Users</h2>
        <div className="error-message">
          <p>Failed to load users. Please try again later.</p>
          <p className="error-details">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="new-users">
      <h2>Newly Registered Users</h2>
      <div className="user-grid">
        <div className="table-header">
          <div>Avatar</div>
          <div>User</div>
          <div>Status</div>
          <div>Role</div>
          <div>User ID</div>
          <div>Actions</div>
        </div>
        <div className="user-table-body">
          {isLoading ? (
            // Loading skeleton rows
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`loading-${index}`} className="user-card loading">
                <div className="user-avatar" />
                <div className="user-info">
                  <div className="user-name" />
                  <div className="user-email" />
                </div>
                <div className="status-badge" />
                <div className="role-badge" />
                <div className="user-id" />
                <div className="card-actions">
                  <div className="action-button" />
                  <div className="action-button" />
                  <div className="action-button" />
                </div>
              </div>
            ))
          ) : newUsers.length > 0 ? (
            newUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={`${user.name}'s avatar`} />
                  ) : (
                    <FaUserCircle className="default-avatar" />
                  )}
                </div>
                <div className="user-info">
                  <h3 className="user-name">
                    {user.name} {user.last_name}
                  </h3>
                  <p className="user-email">{user.email}</p>
                </div>
                <span
                  className={`status-badge status-${user.status || "active"}`}
                >
                  {user.status || "active"}
                </span>
                <span className="role-badge">{user.role || "user"}</span>
                <div className="user-id">
                  {user.id}
                  <button
                    className="copy-button"
                    onClick={() => handleCopy(user.id, user.id)}
                    title="Copy user ID"
                  >
                    {copiedId === user.id ? (
                      <>
                        <FaCheck />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="card-actions">
                  <button
                    className="action-button suspend"
                    onClick={() => handleSuspend(user)}
                    title={
                      user.status === "suspended"
                        ? "Activate user"
                        : "Suspend user"
                    }
                  >
                    <FaBan />
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(user)}
                    title="Delete user"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-users">
              <p>No new users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewUsers;
