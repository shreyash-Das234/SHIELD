import React from "react";

const AlertBox = ({ message, type = "info" }) => {
  const styles = {
    info: "bg-blue-100 text-blue-700 border-blue-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
    danger: "bg-red-100 text-red-700 border-red-400",
    success: "bg-green-100 text-green-700 border-green-400",
  };

  return (
    <div
      className={`border-l-4 p-3 rounded-md ${styles[type]} flex justify-between items-center`}
    >
      <span>{message}</span>

      <span className="text-lg">
        {type === "danger"
          ? "🚨"
          : type === "warning"
          ? "⚠️"
          : type === "success"
          ? "✅"
          : "ℹ️"}
      </span>
    </div>
  );
};

export default AlertBox;