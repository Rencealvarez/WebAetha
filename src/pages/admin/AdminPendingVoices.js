import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "../../styles/AdminPendingVoices.css";

const AdminPendingVoices = () => {
  const [pending, setPending] = useState([]);

  // fetch rows where approved=false
  const fetchPending = async () => {
    const { data, error } = await supabase
      .from("local_voices")
      .select("*")
      .eq("approved", false)
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch pending error:", error);
    else setPending(data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    const { data, error } = await supabase
      .from("local_voices")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      console.error("❌ approve failed:", error);
    } else {
      console.log("✅ approved row:", data);
      fetchPending();
    }
  };

  const handleDelete = async (id) => {
    const { data, error } = await supabase
      .from("local_voices")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ Delete failed:", error);
    } else {
      console.log("🗑️ Row deleted:", data);
      await fetchPending();
    }
  };

  return (
    <div className="admin-pending">
      <h2>Pending Local Voices</h2>
      {pending.length === 0 ? (
        <p>No submissions awaiting approval.</p>
      ) : (
        <div className="pending-grid">
          {pending.map((v) => (
            <div key={v.id} className="pending-card">
              <h5>{v.name}</h5>
              <p className="quote">“{v.quote}”</p>
              {v.image_url && <img src={v.image_url} alt="upload preview" />}
              {v.audio_url && (
                <audio controls>
                  <source src={v.audio_url} type="audio/mpeg" />
                </audio>
              )}
              <div className="actions">
                <button
                  className="btn approve"
                  onClick={() => handleApprove(v.id)}
                >
                  Approve
                </button>
                <button
                  className="btn delete"
                  onClick={() => handleDelete(v.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingVoices;
