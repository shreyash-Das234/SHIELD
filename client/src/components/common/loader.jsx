import React from "react";

const Loader = ({ size = "md" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;