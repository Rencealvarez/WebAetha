import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase";
import jsPDF from "jspdf";
import "../../styles/PrintReports.css";

const PrintReports = () => {
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalVisits: 0,
    qrDownloads: 0,
    dailyRegistrations: 0,
    monthlyRegistrations: 0,
    yearlyRegistrations: 0,
    deviceUsage: { Desktop: 0, Mobile: 0 },
    loginActivity: [],
    selectedPeriod: "daily",
    selectedDate: new Date().toISOString().split("T")[0],
    selectedMonth: new Date().toISOString().substring(0, 7),
    selectedYear: new Date().getFullYear().toString(),
  });

  const [selectedSections, setSelectedSections] = useState({
    summaryStats: true,
    periodRegistrations: true,
    deviceUsage: true,
    loginActivity: true,
  });

  const [loading, setLoading] = useState(false);

  const toLocalDateIso = (input) => {
    const d =
      typeof input === "string" || typeof input === "number"
        ? new Date(input)
        : input;
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  };

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const { selectedPeriod, selectedDate, selectedMonth, selectedYear } =
        reportData;

      const [userRes, loginRes, qrRes] = await Promise.all([
        supabase.from("user_profiles").select("created_at, email"),
        supabase.from("logins").select("logged_in_at, device_type, user_email"),
        supabase.from("qr_download_events").select("created_at"),
      ]);

      const users = userRes.data || [];
      const logins = loginRes.data || [];
      const qrEvents = qrRes.data || [];

      // Calculate filtered data based on selected period
      let filteredUsers = [];
      let filteredLogins = [];
      let filteredQrEvents = [];

      const now = new Date();

      if (selectedPeriod === "daily") {
        const selectedIso = toLocalDateIso(new Date(selectedDate));

        filteredUsers = users.filter((user) => {
          if (!user.created_at) return false;
          return toLocalDateIso(user.created_at) === selectedIso;
        });

        filteredLogins = logins.filter((login) => {
          if (!login.logged_in_at) return false;
          return toLocalDateIso(login.logged_in_at) === selectedIso;
        });

        filteredQrEvents = qrEvents.filter((qr) => {
          if (!qr.created_at) return false;
          return toLocalDateIso(qr.created_at) === selectedIso;
        });
      } else if (selectedPeriod === "monthly") {
        const [yearStr, monthStr] = selectedMonth.split("-");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10); // 1..12

        const isSameLocalMonth = (timestamp) => {
          const iso = toLocalDateIso(timestamp);
          const [y, m] = iso.split("-").map((v) => parseInt(v, 10));
          return y === year && m === month;
        };

        filteredUsers = users.filter(
          (user) => user.created_at && isSameLocalMonth(user.created_at)
        );
        filteredLogins = logins.filter(
          (login) => login.logged_in_at && isSameLocalMonth(login.logged_in_at)
        );
        filteredQrEvents = qrEvents.filter(
          (qr) => qr.created_at && isSameLocalMonth(qr.created_at)
        );
      } else if (selectedPeriod === "yearly") {
        const year = parseInt(selectedYear, 10);

        const isSameLocalYear = (timestamp) => {
          const iso = toLocalDateIso(timestamp);
          const [y] = iso.split("-").map((v) => parseInt(v, 10));
          return y === year;
        };

        filteredUsers = users.filter(
          (user) => user.created_at && isSameLocalYear(user.created_at)
        );
        filteredLogins = logins.filter(
          (login) => login.logged_in_at && isSameLocalYear(login.logged_in_at)
        );
        filteredQrEvents = qrEvents.filter(
          (qr) => qr.created_at && isSameLocalYear(qr.created_at)
        );
      }

      // Calculate device usage
      const deviceCounts = { Desktop: 0, Mobile: 0 };
      filteredLogins.forEach((login) => {
        if (login.device_type === "Desktop") deviceCounts.Desktop++;
        else if (login.device_type === "Mobile") deviceCounts.Mobile++;
      });

      // Calculate login activity (last 7 days for context)
      const loginActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = toLocalDateIso(date);

        const dayLogins = logins.filter((login) => {
          if (!login.logged_in_at) return false;
          return toLocalDateIso(login.logged_in_at) === dateStr;
        }).length;

        loginActivity.push({
          date: dateStr,
          count: dayLogins,
          label: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        });
      }

      setReportData((prev) => ({
        ...prev,
        totalUsers: users.length,
        totalVisits: logins.length,
        qrDownloads: qrEvents.length,
        // period-specific counts for preview/report
        periodUsers: filteredUsers.length,
        periodVisits: filteredLogins.length,
        periodQrDownloads: filteredQrEvents.length,
        dailyRegistrations:
          selectedPeriod === "daily" ? filteredUsers.length : 0,
        monthlyRegistrations:
          selectedPeriod === "monthly" ? filteredUsers.length : 0,
        yearlyRegistrations:
          selectedPeriod === "yearly" ? filteredUsers.length : 0,
        deviceUsage: deviceCounts,
        loginActivity: loginActivity,
      }));
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    reportData.selectedPeriod,
    reportData.selectedDate,
    reportData.selectedMonth,
    reportData.selectedYear,
  ]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const generatePDF = () => {
    // Check if at least one section is selected
    const hasSelectedSections = Object.values(selectedSections).some(
      (selected) => selected
    );
    if (!hasSelectedSections) {
      alert("Please select at least one section to include in the report.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("AETHA Analytics Report", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    // Report period
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const periodText =
      reportData.selectedPeriod === "daily"
        ? `Daily Report - ${new Date(
            reportData.selectedDate
          ).toLocaleDateString()}`
        : reportData.selectedPeriod === "monthly"
        ? `Monthly Report - ${new Date(
            reportData.selectedMonth + "-01"
          ).toLocaleDateString("en-US", { year: "numeric", month: "long" })}`
        : `Yearly Report - ${reportData.selectedYear}`;

    doc.text(periodText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Generated date
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 20;

    // Summary Statistics (if selected)
    if (selectedSections.summaryStats) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Summary Statistics", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // Total users
      doc.text(
        `Total Registered Users: ${reportData.totalUsers}`,
        20,
        yPosition
      );
      yPosition += 8;

      doc.text(`Total Visits: ${reportData.totalVisits}`, 20, yPosition);
      yPosition += 8;
      doc.text(`QR/App Downloads: ${reportData.qrDownloads}`, 20, yPosition);
      yPosition += 15;
    }

    // Period-specific registrations (if selected)
    if (selectedSections.periodRegistrations) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Period Registrations", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      if (reportData.selectedPeriod === "daily") {
        doc.text(
          `New Registrations Today: ${reportData.dailyRegistrations}`,
          20,
          yPosition
        );
      } else if (reportData.selectedPeriod === "monthly") {
        doc.text(
          `New Registrations This Month: ${reportData.monthlyRegistrations}`,
          20,
          yPosition
        );
      } else {
        doc.text(
          `New Registrations This Year: ${reportData.yearlyRegistrations}`,
          20,
          yPosition
        );
      }
      yPosition += 15;
    }

    // Device Usage (if selected)
    if (selectedSections.deviceUsage) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Device Usage", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const totalDevices =
        reportData.deviceUsage.Desktop + reportData.deviceUsage.Mobile;
      const desktopPercent =
        totalDevices > 0
          ? Math.round((reportData.deviceUsage.Desktop / totalDevices) * 100)
          : 0;
      const mobilePercent =
        totalDevices > 0
          ? Math.round((reportData.deviceUsage.Mobile / totalDevices) * 100)
          : 0;

      doc.text(
        `Desktop: ${reportData.deviceUsage.Desktop} (${desktopPercent}%)`,
        20,
        yPosition
      );
      yPosition += 8;
      doc.text(
        `Mobile: ${reportData.deviceUsage.Mobile} (${mobilePercent}%)`,
        20,
        yPosition
      );
      yPosition += 15;
    }

    // Recent Activity (Last 7 Days) (if selected)
    if (selectedSections.loginActivity) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Recent Login Activity (Last 7 Days)", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      reportData.loginActivity.forEach((activity) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`${activity.label}: ${activity.count} logins`, 20, yPosition);
        yPosition += 6;
      });
    }

    // Footer
    yPosition = pageHeight - 20;
    doc.setFontSize(8);
    doc.text("AETHA", pageWidth / 2, yPosition, { align: "center" });

    // Save the PDF
    const fileName = `AETHA-Report-${
      reportData.selectedPeriod
    }-${Date.now()}.pdf`;
    doc.save(fileName);
  };

  const handlePeriodChange = (period) => {
    setReportData((prev) => ({ ...prev, selectedPeriod: period }));
  };

  const handleDateChange = (date) => {
    setReportData((prev) => ({ ...prev, selectedDate: date }));
  };

  const handleMonthChange = (month) => {
    setReportData((prev) => ({ ...prev, selectedMonth: month }));
  };

  const handleYearChange = (year) => {
    setReportData((prev) => ({ ...prev, selectedYear: year }));
  };

  const handleSectionToggle = (section) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSelectAll = () => {
    setSelectedSections({
      summaryStats: true,
      periodRegistrations: true,
      deviceUsage: true,
      loginActivity: true,
    });
  };

  const handleDeselectAll = () => {
    setSelectedSections({
      summaryStats: false,
      periodRegistrations: false,
      deviceUsage: false,
      loginActivity: false,
    });
  };

  return (
    <div className="print-reports">
      <div className="reports-header">
        <h2>Print Reports</h2>
        <p>
          Generate printable PDF reports with detailed analytics and statistics
        </p>
      </div>

      <div className="report-controls">
        <div className="period-selector">
          <label>Report Period:</label>
          <div className="period-buttons">
            <button
              className={reportData.selectedPeriod === "daily" ? "active" : ""}
              onClick={() => handlePeriodChange("daily")}
            >
              Daily
            </button>
            <button
              className={
                reportData.selectedPeriod === "monthly" ? "active" : ""
              }
              onClick={() => handlePeriodChange("monthly")}
            >
              Monthly
            </button>
            <button
              className={reportData.selectedPeriod === "yearly" ? "active" : ""}
              onClick={() => handlePeriodChange("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="date-selector">
          {reportData.selectedPeriod === "daily" && (
            <div className="date-input">
              <label>Select Date:</label>
              <input
                type="date"
                value={reportData.selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
          )}

          {reportData.selectedPeriod === "monthly" && (
            <div className="date-input">
              <label>Select Month:</label>
              <input
                type="month"
                value={reportData.selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
              />
            </div>
          )}

          {reportData.selectedPeriod === "yearly" && (
            <div className="date-input">
              <label>Select Year:</label>
              <select
                value={reportData.selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        <button
          className="generate-pdf-btn"
          onClick={generatePDF}
          disabled={
            loading ||
            !Object.values(selectedSections).some((selected) => selected)
          }
        >
          {loading ? "Loading..." : "Generate PDF Report"}
        </button>
      </div>

      <div className="main-content-grid">
        <div className="section-selector">
          <h3>Select Report Sections</h3>
          <p>Choose which sections to include in your PDF report:</p>

          <div className="section-controls">
            <button className="select-all-btn" onClick={handleSelectAll}>
              Select All
            </button>
            <button className="deselect-all-btn" onClick={handleDeselectAll}>
              Deselect All
            </button>
          </div>

          <div className="section-checkboxes">
            <div className="section-option">
              <input
                type="checkbox"
                id="summaryStats"
                checked={selectedSections.summaryStats}
                onChange={() => handleSectionToggle("summaryStats")}
              />
              <label htmlFor="summaryStats">
                <strong>Summary Statistics</strong>
                <span>Total users, visits, and QR downloads</span>
              </label>
            </div>

            <div className="section-option">
              <input
                type="checkbox"
                id="periodRegistrations"
                checked={selectedSections.periodRegistrations}
                onChange={() => handleSectionToggle("periodRegistrations")}
              />
              <label htmlFor="periodRegistrations">
                <strong>Period Registrations</strong>
                <span>New registrations for selected period</span>
              </label>
            </div>

            <div className="section-option">
              <input
                type="checkbox"
                id="deviceUsage"
                checked={selectedSections.deviceUsage}
                onChange={() => handleSectionToggle("deviceUsage")}
              />
              <label htmlFor="deviceUsage">
                <strong>Device Usage</strong>
                <span>Desktop vs Mobile usage statistics</span>
              </label>
            </div>

            <div className="section-option">
              <input
                type="checkbox"
                id="loginActivity"
                checked={selectedSections.loginActivity}
                onChange={() => handleSectionToggle("loginActivity")}
              />
              <label htmlFor="loginActivity">
                <strong>Login Activity</strong>
                <span>Recent login activity (last 7 days)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="report-preview">
          <h3>Report Preview</h3>
          <p className="preview-note">
            Showing only selected sections. Uncheck sections above to exclude
            them from the PDF.
          </p>

          <div className="preview-cards">
            {selectedSections.summaryStats && (
              <>
                <div className="preview-card">
                  <h4>Total Users</h4>
                  <p>{reportData.totalUsers}</p>
                </div>
                <div className="preview-card">
                  <h4>
                    {reportData.selectedPeriod === "daily" &&
                      "Visits (Selected Day)"}
                    {reportData.selectedPeriod === "monthly" &&
                      "Visits (Selected Month)"}
                    {reportData.selectedPeriod === "yearly" &&
                      "Visits (Selected Year)"}
                  </h4>
                  <p>{reportData.periodVisits ?? 0}</p>
                </div>
                <div className="preview-card">
                  <h4>
                    {reportData.selectedPeriod === "daily" &&
                      "QR Downloads (Selected Day)"}
                    {reportData.selectedPeriod === "monthly" &&
                      "QR Downloads (Selected Month)"}
                    {reportData.selectedPeriod === "yearly" &&
                      "QR Downloads (Selected Year)"}
                  </h4>
                  <p>{reportData.periodQrDownloads ?? 0}</p>
                </div>
              </>
            )}

            {selectedSections.periodRegistrations && (
              <div className="preview-card">
                <h4>
                  {reportData.selectedPeriod === "daily" &&
                    "Today's Registrations"}
                  {reportData.selectedPeriod === "monthly" &&
                    "This Month's Registrations"}
                  {reportData.selectedPeriod === "yearly" &&
                    "This Year's Registrations"}
                </h4>
                <p>
                  {reportData.selectedPeriod === "daily" &&
                    reportData.dailyRegistrations}
                  {reportData.selectedPeriod === "monthly" &&
                    reportData.monthlyRegistrations}
                  {reportData.selectedPeriod === "yearly" &&
                    reportData.yearlyRegistrations}
                </p>
              </div>
            )}
          </div>

          {selectedSections.deviceUsage && (
            <div className="device-usage-preview">
              <h4>Device Usage</h4>
              <div className="device-stats">
                <div className="device-stat">
                  <span className="device-label">Desktop:</span>
                  <span className="device-count">
                    {reportData.deviceUsage.Desktop}
                  </span>
                </div>
                <div className="device-stat">
                  <span className="device-label">Mobile:</span>
                  <span className="device-count">
                    {reportData.deviceUsage.Mobile}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedSections.loginActivity && (
            <div className="login-activity-preview">
              <h4>Recent Login Activity (Last 7 Days)</h4>
              <div className="activity-stats">
                {reportData.loginActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-date">{activity.label}:</span>
                    <span className="activity-count">
                      {activity.count} logins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedSections.summaryStats &&
            !selectedSections.periodRegistrations &&
            !selectedSections.deviceUsage &&
            !selectedSections.loginActivity && (
              <div className="no-sections-selected">
                <p>
                  ⚠️ No sections selected. Please select at least one section to
                  generate a report.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PrintReports;
