import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/admin.css";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const Admin = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [weeklyVisits, setWeeklyVisits] = useState([]);
  const [weeklyLabels, setWeeklyLabels] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loginEvents, setLoginEvents] = useState([]);
  const [deviceData, setDeviceData] = useState([0, 0]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [selectedRange, setSelectedRange] = useState("week");
  const [quizStats, setQuizStats] = useState({});
  const [feedbackStats, setFeedbackStats] = useState({});

  const fetchDashboardData = async () => {
    try {
      const [userRes, loginRes, usersList, loginData, quizRes, feedbackRes] =
        await Promise.all([
          supabase.from("users").select("*", { count: "exact", head: true }),
          supabase.from("logins").select("*", { count: "exact", head: true }),
          supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("logins").select("logged_in_at, device_type"),
          supabase.from("quiz_logs").select("*"),
          supabase.from("feedback_logs").select("image_path, emoji"),
        ]);

      setUserCount(userRes.count || 0);
      setVisitorCount(loginRes.count || 0);
      setNewUsers(usersList.data || []);
      setLoginEvents(loginData.data || []);
      processVisits("week", loginData.data || []);

      // ✅ Process Quiz Stats
      const stats = {};
      quizRes.data?.forEach((log) => {
        const img = log.image_path?.trim();
        if (!img) return;
        if (!stats[img]) stats[img] = { total: 0, correct: 0 };
        stats[img].total++;
        if (log.is_correct) stats[img].correct++;
      });
      setQuizStats(stats);

      // ✅ Process Feedback
      const fbStats = {};
      feedbackRes.data?.forEach(({ image_path, emoji }) => {
        const path = image_path.trim().replace(/^\//, "");
        if (!fbStats[path]) fbStats[path] = { "👍": 0, "😐": 0, "👎": 0 };
        if (fbStats[path][emoji] !== undefined) {
          fbStats[path][emoji]++;
        }
      });
      setFeedbackStats(fbStats);

      // ✅ Device Data
      const deviceCounts = { Desktop: 0, Mobile: 0 };
      loginData.data.forEach((log) => {
        if (log.device_type === "Desktop") deviceCounts.Desktop++;
        else if (log.device_type === "Mobile") deviceCounts.Mobile++;
      });
      setDeviceData([deviceCounts.Desktop, deviceCounts.Mobile]);

      // ✅ Progress
      const today = new Date();
      let todayLogins = 0;
      loginData.data.forEach((log) => {
        const loginDate = new Date(log.logged_in_at);
        if (
          loginDate.getDate() === today.getDate() &&
          loginDate.getMonth() === today.getMonth() &&
          loginDate.getFullYear() === today.getFullYear()
        ) {
          todayLogins++;
        }
      });

      const progress = userRes.count
        ? Math.min(100, Math.round((todayLogins / userRes.count) * 100))
        : 0;

      setProgressPercent(progress);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const processVisits = (range, loginData) => {
    const today = new Date();
    if (!loginData) return;

    if (range === "week") {
      const dailyVisits = {};
      const labels = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const label = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        labels.push(label);
        dailyVisits[label] = 0;
      }

      loginData.forEach((log) => {
        const loginDate = new Date(log.logged_in_at);
        const label = loginDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (dailyVisits[label] !== undefined) {
          dailyVisits[label]++;
        }
      });

      setWeeklyVisits(Object.values(dailyVisits));
      setWeeklyLabels(labels);
    } else if (range === "month") {
      const weeklyVisits = [0, 0, 0, 0];
      loginData.forEach((log) => {
        const loginDate = new Date(log.logged_in_at);
        const diffDays = Math.floor(
          (today - loginDate) / (1000 * 60 * 60 * 24)
        );
        const weekIndex = Math.floor(diffDays / 7);
        if (weekIndex >= 0 && weekIndex <= 3) {
          weeklyVisits[3 - weekIndex]++;
        }
      });

      setWeeklyVisits(weeklyVisits);
      setWeeklyLabels(["Week 1", "Week 2", "Week 3", "Week 4"]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const feedbackBarData = {
    labels: Object.keys(feedbackStats),
    datasets: [
      {
        label: "👍",
        backgroundColor: "#4CAF50",
        data: Object.values(feedbackStats).map((img) => img["👍"] || 0),
      },
      {
        label: "😐",
        backgroundColor: "#FFC107",
        data: Object.values(feedbackStats).map((img) => img["😐"] || 0),
      },
      {
        label: "👎",
        backgroundColor: "#F44336",
        data: Object.values(feedbackStats).map((img) => img["👎"] || 0),
      },
    ],
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <h3 className="admin-title">Admin</h3>
        <button className="btn btn-success" onClick={() => navigate("/")}>
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <h5>Total Registered Users</h5>
            <h2>{userCount}</h2>
          </div>
          <div className="card">
            <h5>Total Visits</h5>
            <h2>{visitorCount}</h2>
          </div>
          <div className="card">
            <h5>Progress Report</h5>
            <h2>{progressPercent}%</h2>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section">
          <div className="line-chart">
            <h4>Network Activities</h4>
            <Line
              data={{
                labels: weeklyLabels,
                datasets: [
                  {
                    label: "Visits",
                    data: weeklyVisits,
                    fill: true,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    tension: 0.4,
                  },
                ],
              }}
            />
          </div>

          <div className="doughnut-chart">
            <h4>Device Usage</h4>
            <Doughnut
              data={{
                labels: ["Desktop", "Mobile"],
                datasets: [
                  {
                    data: deviceData,
                    backgroundColor: ["#36A2EB", "#FF6384"],
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Feedback Stats Chart */}
        <div className="bar-chart mt-4">
          <h4>Feedback Per Image</h4>
          <Bar data={feedbackBarData} />
        </div>

        {/* New Users */}
        <div className="new-users">
          <h4>New Registered Users</h4>
          <div className="new-users-grid">
            {newUsers.map((user) => (
              <div key={user.id} className="user-card">
                <h5>
                  {user.name} {user.last_name}
                </h5>
                <p>Email: {user.email}</p>
                <p className="small-text">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="quiz-stats mt-4">
          <h4>Quiz Statistics</h4>
          <div className="quiz-list">
            {Object.entries(quizStats).map(([img, stat], i) => (
              <div key={i} className="quiz-card">
                <h6>{img}</h6>
                <p>Total Attempts: {stat.total}</p>
                <p>Correct Answers: {stat.correct}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
