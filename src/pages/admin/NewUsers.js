import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "../../styles/NewUsers.css";

const NewUsers = () => {
  const [newUsers, setNewUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching new users:", error.message);
        return;
      }

      setNewUsers(data || []);
    };

    fetchUsers();
  }, []);

  return (
    <div className="new-users">
      <h2>Newly Registered Users</h2>
      <div className="user-grid">
        {newUsers.length > 0 ? (
          newUsers.map((user) => (
            <div key={user.id} className="user-card">
              <h5>
                {user.name} {user.last_name}
              </h5>
              <p>Email: {user.email}</p>
              <p className="small-text">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No new users found.</p>
        )}
      </div>
    </div>
  );
};

export default NewUsers;
