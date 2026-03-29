import React from "react";

const StatCard = ({ title, value, icon, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
      
      {/* Left */}
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>

      {/* Icon */}
      <div className={`p-3 rounded-full ${colors[color]}`}>
        {icon}
      </div>

    </div>
  );
};

export default StatCard;