import React from "react";

const Navbar = () => {
  return (
    <div className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center">
      
      {/* Logo / Title */}
      <div className="text-xl font-bold text-blue-600">
        SHIELD
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Alert Icon */}
        <div className="relative cursor-pointer">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
            U
          </div>
          <span className="font-medium">User</span>
        </div>

      </div>
    </div>
  );
};

export default Navbar;