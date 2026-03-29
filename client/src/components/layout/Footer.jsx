import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-white border-t mt-auto py-3 text-center text-sm text-gray-600">
      © {new Date().getFullYear()} SHIELD Security Panel. All rights reserved.
    </div>
  );
};

export default Footer;