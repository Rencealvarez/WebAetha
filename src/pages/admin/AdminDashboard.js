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
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
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
  const [qrEventsCount, setQREventsCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [userRes, loginRes, loginRaw, qrCountRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("*", { count: "exact", head: true }),
        supabase.from("logins").select("*", { count: "exact", head: true }),
        supabase.from("logins").select("logged_in_at, device_type, user_email"),
        supabase
          .from("qr_download_events")
          .select("id", { count: "exact", head: true }),
      ]);

      setUserCount(userRes.count || 0);
      setVisitorCount(loginRes.count || 0);
      setLoginData(loginRaw.data || []);
      setQREventsCount(qrCountRes.count || 0);

      // Device usage
      const deviceCounts = { Desktop: 0, Mobile: 0 };
      (loginRaw.data || []).forEach((log) => {
        if (log.device_type === "Desktop") deviceCounts.Desktop++;
        else if (log.device_type === "Mobile") deviceCounts.Mobile++;
      });
      setDeviceData([deviceCounts.Desktop, deviceCounts.Mobile]);

      // 🌐 Progress Report Calculation with local date
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const uniqueEmails = new Set();

      console.log("🔍 Today (ISO):", todayStr);

      (loginRaw.data || []).forEach((log) => {
        const logDate = new Date(log.logged_in_at);
        const localDate = new Date(
          logDate.getTime() - logDate.getTimezoneOffset() * 60000
        );
        const logStr = localDate.toISOString().split("T")[0];

        if (logStr === todayStr) {
          console.log("✅ Match:", log.user_email);
          uniqueEmails.add(log.user_email);
        }
      });

      const todayLogins = uniqueEmails.size;
      const progress = userRes.count
        ? Math.min(100, Math.round((todayLogins / userRes.count) * 100))
        : 0;

      console.log("👥 Total Users:", userRes.count);
      console.log("📥 Today's Unique Logins:", todayLogins);
      console.log("📊 Progress:", progress + "%");

      setProgressPercent(progress);
      processVisits("week", loginRaw.data || []);
    };

    fetchDashboardData();
  }, []);

  const processVisits = (range, data) => {
    const today = new Date();

    if (range === "week") {
      const daily = {};
      const labels = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        labels.push(label);
        daily[key] = 0;
      }

      (data || []).forEach((log) => {
        const logDate = new Date(log.logged_in_at);
        const localDate = new Date(
          logDate.getTime() - logDate.getTimezoneOffset() * 60000
        );
        const logKey = localDate.toISOString().split("T")[0];

        if (daily[logKey] !== undefined) {
          daily[logKey]++;
        }
      });

      setWeeklyLabels(labels);
      setWeeklyVisits(Object.values(daily));
    } else {
      const weeks = [0, 0, 0, 0];
      (data || []).forEach((log) => {
        const logDate = new Date(log.logged_in_at);
        const localDate = new Date(
          logDate.getTime() - logDate.getTimezoneOffset() * 60000
        );
        const diffDays = Math.floor(
          (today - localDate) / (1000 * 60 * 60 * 24)
        );
        const weekIndex = Math.min(3, Math.floor(diffDays / 7));
        weeks[3 - weekIndex]++;
      });

      setWeeklyLabels(["Week 1", "Week 2", "Week 3", "Week 4"]);
      setWeeklyVisits(weeks);
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
          <h5>QR/App Downloads (tracked)</h5>
          <h2>{qrEventsCount}</h2>
        </div>
        <div className="card summary-card">
          <h5>Progress Report</h5>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar"
              style={{ width: `${progressPercent}%` }}
            />
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
