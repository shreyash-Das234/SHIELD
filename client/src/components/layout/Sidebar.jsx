import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Traffic", path: "/traffic" },
    { name: "Attacks", path: "/attacks" },
    { name: "Blocked IPs", path: "/blocked" },
    { name: "API Keys", path: "/apikeys" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-center">SHIELD</h2>

      {/* Menu */}
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;