import React from "react";
import "../styles/loader.css";

const Loader = ({ label = "Loading...", fullscreen = false, size = "md" }) => {
  const containerClass = fullscreen
    ? "loader-container fullscreen"
    : "loader-container";
  const spinnerClass = `loader-spinner ${size}`;
  return (
    <div className={containerClass} role="status" aria-busy="true">
      <div className={spinnerClass} />
      {label && <div className="loader-label">{label}</div>}
    </div>
  );
};

export default Loader;
