import React from "react";
import MainLayout from "../components/layout/MainLayout";
import LogsTable from "../components/tables/LogsTable";

const logsData = [
  { type: "Detection", message: "HTTP flood detected on /login", severity: "high", time: "10:05 AM" },
  { type: "Detection", message: "Bot pattern detected from suspicious headers", severity: "medium", time: "10:08 AM" },
];

const Attacks = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Detected Attacks</h1>
        <LogsTable data={logsData} />
      </div>
    </MainLayout>
  );
};

export default Attacks;