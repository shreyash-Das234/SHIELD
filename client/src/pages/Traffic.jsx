import React from "react";
import MainLayout from "../components/layout/MainLayout";
import TrafficTable from "../components/tables/TrafficTable";

const trafficData = [
  { ip: "192.168.1.1", path: "/login", method: "POST", status: 200, time: "10:01 AM" },
  { ip: "10.0.0.5", path: "/api/data", method: "GET", status: 429, time: "10:03 AM" },
  { ip: "45.22.18.9", path: "/auth", method: "POST", status: 403, time: "10:04 AM" },
];

const Traffic = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Traffic Monitoring</h1>
        <TrafficTable data={trafficData} />
      </div>
    </MainLayout>
  );
};

export default Traffic;