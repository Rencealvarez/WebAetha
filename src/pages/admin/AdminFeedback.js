import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "../../styles/AdminFeedback.css";

const AdminFeedback = () => {
  const [feedbackCounts, setFeedbackCounts] = useState({});

  const fetchFeedbackCounts = async () => {
    const { data, error } = await supabase
      .from("feedback_logs")
      .select("image_path, emoji");

    if (error) {
      console.error("Error fetching feedback logs:", error.message);
      return;
    }

    const counts = {};
    data.forEach(({ image_path, emoji }) => {
      const key = image_path.trim().replace(/^\//, "");
      if (!counts[key]) counts[key] = { "👍": 0, "😐": 0, "👎": 0 };
      counts[key][emoji]++;
    });

    setFeedbackCounts(counts);
  };

  useEffect(() => {
    fetchFeedbackCounts();
  }, []);

  return (
    <div className="admin-feedback">
      <h2>Feedback per Panorama Image</h2>
      <div className="feedback-grid">
        {Object.entries(feedbackCounts).map(([image, counts]) => (
          <div key={image} className="feedback-card">
            <h5>{image}</h5>
            <p>👍 {counts["👍"]}</p>
            <p>😐 {counts["😐"]}</p>
            <p>👎 {counts["👎"]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFeedback;
