import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <Navbar />
        <div className="p-6 flex-1 bg-gray-100">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;