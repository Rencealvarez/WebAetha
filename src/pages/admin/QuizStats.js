import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabase";
import "../../styles/QuizStats.css";
import Loader from "../../components/Loader";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuizStats = () => {
  const [quizStats, setQuizStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "accuracy",
    direction: "desc",
  });
  const [filter, setFilter] = useState("all");

  // Function to convert image path to readable name
  const formatImageName = (imagePath) => {
    return imagePath
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  useEffect(() => {
    const fetchQuizLogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("quiz_logs").select("*");

        if (error) throw error;

        const stats = {};
        data.forEach((log) => {
          const img = log.image_path?.trim();
          if (!img) return;

          if (!stats[img]) {
            stats[img] = {
              total: 0,
              correct: 0,
              lastAttempt: null,
              attempts: [],
            };
          }
          stats[img].total++;
          if (log.is_correct) stats[img].correct++;
          stats[img].lastAttempt = log.created_at;
          stats[img].attempts.push({
            isCorrect: log.is_correct,
            timestamp: log.created_at,
          });
        });

        setQuizStats(stats);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching quiz logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizLogs();
  }, []);

  // Sort and filter stats
  const processedStats = useMemo(() => {
    let filtered = Object.entries(quizStats);

    // Apply filter
    if (filter === "high") {
      filtered = filtered.filter(
        ([_, stat]) => stat.correct / stat.total >= 0.7
      );
    } else if (filter === "low") {
      filtered = filtered.filter(
        ([_, stat]) => stat.correct / stat.total < 0.7
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const [_, statA] = a;
      const [__, statB] = b;
      const accuracyA = statA.correct / statA.total;
      const accuracyB = statB.correct / statB.total;

      if (sortConfig.key === "accuracy") {
        return sortConfig.direction === "asc"
          ? accuracyA - accuracyB
          : accuracyB - accuracyA;
      } else if (sortConfig.key === "attempts") {
        return sortConfig.direction === "asc"
          ? statA.total - statB.total
          : statB.total - statA.total;
      }
      return 0;
    });
  }, [quizStats, sortConfig, filter]);

  // Prepare data for chart
  const chartData = {
    labels: processedStats.map(([image]) => formatImageName(image)),
    datasets: [
      {
        label: "Accuracy (%)",
        data: processedStats.map(
          ([_, stat]) => (stat.correct / stat.total) * 100
        ),
        backgroundColor: "rgba(52, 152, 219, 0.6)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Quiz Accuracy by Image",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            // Show formatted file name in tooltip title
            const imagePath = processedStats[context[0].dataIndex][0];
            return formatImageName(imagePath);
          },
          label: function (context) {
            const stat = processedStats[context.dataIndex][1];
            return [
              `Accuracy: ${((stat.correct / stat.total) * 100).toFixed(1)}%`,
              `Total Attempts: ${stat.total}`,
              `Correct Answers: ${stat.correct}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Accuracy (%)",
          font: {
            weight: "bold",
          },
        },
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
      x: {
        ticks: {
          font: {
            size: 16,
            weight: "bold",
          },
          color: "#2d3748",
          maxRotation: processedStats.length > 4 ? 30 : 0,
          minRotation: processedStats.length > 4 ? 30 : 0,
          padding: 10,
          callback: function (value, index, values) {
            const label = this.getLabelForValue(value);
            // Truncate if too long
            return label.length > 12 ? label.slice(0, 12) + "…" : label;
          },
        },
      },
    },
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  if (loading) {
    return <Loader label="Loading quiz statistics" fullscreen size="lg" />;
  }

  if (error) {
    return (
      <div className="quiz-stats error" role="alert">
        <h2>Error Loading Statistics</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-stats">
      <header className="stats-header">
        <h1>Quiz Performance Analytics</h1>
        <p className="stats-description">
          Detailed statistics showing quiz performance across different images
        </p>
      </header>

      <div className="dashboard-content">
        <section className="stats-overview">
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </section>

        <section className="stats-details">
          <div className="stats-controls">
            <div className="filter-controls">
              <label htmlFor="filter">Filter by Performance:</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => handleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Results</option>
                <option value="high">High Performance (≥70%)</option>
                <option value="low">Low Performance (&lt;70%)</option>
              </select>
            </div>
            <div className="sort-controls">
              <button
                onClick={() => handleSort("accuracy")}
                className={`sort-button ${
                  sortConfig.key === "accuracy" ? "active" : ""
                }`}
              >
                Sort by Accuracy{" "}
                {sortConfig.key === "accuracy" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSort("attempts")}
                className={`sort-button ${
                  sortConfig.key === "attempts" ? "active" : ""
                }`}
              >
                Sort by Attempts{" "}
                {sortConfig.key === "attempts" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </button>
            </div>
          </div>

          <h2>Detailed Statistics</h2>
          <div className="quiz-grid">
            {processedStats.map(([image, stat], index) => (
              <div key={index} className="quiz-card" role="article">
                <h3>{formatImageName(image)}</h3>
                <div className="stat-group">
                  <div className="stat-item">
                    <span className="stat-label">Total Attempts</span>
                    <span className="stat-value">{stat.total}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Correct Answers</span>
                    <span className="stat-value">{stat.correct}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Accuracy</span>
                    <span className="stat-value">
                      {stat.total > 0
                        ? ((stat.correct / stat.total) * 100).toFixed(1) + "%"
                        : "0%"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last Attempt</span>
                    <span className="stat-value">
                      {stat.lastAttempt
                        ? new Date(stat.lastAttempt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="tooltip">
                  <span className="tooltip-icon" aria-label="More information">
                    ℹ️
                  </span>
                  <span className="tooltip-text">
                    Shows performance metrics for this specific quiz image
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuizStats;
