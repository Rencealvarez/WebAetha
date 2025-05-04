import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "../../styles/AdminDashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loginData, setLoginData] = useState([]);
  const [deviceData, setDeviceData] = useState([0, 0]);
  const [weeklyVisits, setWeeklyVisits] = useState([]);
  const [weeklyLabels, setWeeklyLabels] = useState([]);
  const [selectedRange, setSelectedRange] = useState("week");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [userRes, loginRes, loginRaw] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("logins").select("*", { count: "exact", head: true }),
        supabase.from("logins").select("logged_in_at, device_type"),
      ]);

      setUserCount(userRes.count || 0);
      setVisitorCount(loginRes.count || 0);
      setLoginData(loginRaw.data || []);

      // Device chart
      const deviceCounts = { Desktop: 0, Mobile: 0 };
      loginRaw.data.forEach((log) => {
        if (log.device_type === "Desktop") deviceCounts.Desktop++;
        else if (log.device_type === "Mobile") deviceCounts.Mobile++;
      });
      setDeviceData([deviceCounts.Desktop, deviceCounts.Mobile]);

      // Progress bar
      const today = new Date();
      let todayLogins = 0;
      loginRaw.data.forEach((log) => {
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

      processVisits("week", loginRaw.data);
    };

    fetchDashboardData();
  }, []);

  const processVisits = (range, data) => {
    const today = new Date();

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

      data.forEach((log) => {
        const loginDate = new Date(log.logged_in_at);
        const label = loginDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (dailyVisits[label] !== undefined) {
          dailyVisits[label]++;
        }
      });

      setWeeklyLabels(labels);
      setWeeklyVisits(Object.values(dailyVisits));
    } else if (range === "month") {
      const weeklyVisits = [0, 0, 0, 0];
      data.forEach((log) => {
        const loginDate = new Date(log.logged_in_at);
        const diffDays = Math.floor(
          (today - loginDate) / (1000 * 60 * 60 * 24)
        );
        const weekIndex = Math.floor(diffDays / 7);
        if (weekIndex >= 0 && weekIndex <= 3) {
          weeklyVisits[3 - weekIndex]++;
        }
      });

      setWeeklyLabels(["Week 1", "Week 2", "Week 3", "Week 4"]);
      setWeeklyVisits(weeklyVisits);
    }
  };

  const lineChartData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: "Logins",
        data: weeklyVisits,
        fill: true,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Desktop", "Mobile"],
    datasets: [
      {
        data: deviceData,
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>

      <div className="dashboard-cards">
        <div className="card summary-card">
          <h5>Total Registered Users</h5>
          <h2>{userCount}</h2>
        </div>
        <div className="card summary-card">
          <h5>Total Visits</h5>
          <h2>{visitorCount}</h2>
        </div>
        <div className="card summary-card">
          <h5>Progress Report</h5>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p>{progressPercent}%</p>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-header">
            <h4>Network Activities</h4>
            <div className="report-buttons">
              <button
                className={selectedRange === "week" ? "active" : ""}
                onClick={() => {
                  setSelectedRange("week");
                  processVisits("week", loginData);
                }}
              >
                Weekly
              </button>
              <button
                className={selectedRange === "month" ? "active" : ""}
                onClick={() => {
                  setSelectedRange("month");
                  processVisits("month", loginData);
                }}
              >
                Monthly
              </button>
            </div>
          </div>
          <Line data={lineChartData} />
        </div>
        <div className="chart-container">
          <h4>Device Usage</h4>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
