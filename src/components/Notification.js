import React from "react";
import "../styles/notification.css";

const Notification = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={`custom-notification ${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
