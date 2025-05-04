import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "../../styles/QuizStats.css";

const QuizStats = () => {
  const [quizStats, setQuizStats] = useState({});

  useEffect(() => {
    const fetchQuizLogs = async () => {
      const { data, error } = await supabase.from("quiz_logs").select("*");

      if (error) {
        console.error("Error fetching quiz logs:", error.message);
        return;
      }

      const stats = {};
      data.forEach((log) => {
        const img = log.image_path?.trim();
        if (!img) return;

        if (!stats[img]) stats[img] = { total: 0, correct: 0 };
        stats[img].total++;
        if (log.is_correct) stats[img].correct++;
      });

      setQuizStats(stats);
    };

    fetchQuizLogs();
  }, []);

  return (
    <div className="quiz-stats">
      <h2>Quiz Statistics</h2>
      <div className="quiz-grid">
        {Object.entries(quizStats).map(([image, stat], index) => (
          <div key={index} className="quiz-card">
            <h6>{image}</h6>
            <p>Total Attempts: {stat.total}</p>
            <p>Correct Answers: {stat.correct}</p>
            <p>
              Accuracy:{" "}
              {stat.total > 0
                ? ((stat.correct / stat.total) * 100).toFixed(1) + "%"
                : "0%"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizStats;
