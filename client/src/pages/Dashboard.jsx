import React from "react";
import MainLayout from "../components/layout/MainLayout";
import StatCard from "../components/widgets/StatCard";
import AlertBox from "../components/widgets/AlertBox";
import TrafficChart from "../components/charts/TrafficChart";
import AttackGraph from "../components/charts/AttackGraph";
import GeoMap from "../components/charts/GeoMap";

const trafficData = [
  { time: "10:00", requests: 120 },
  { time: "10:05", requests: 300 },
  { time: "10:10", requests: 900 },
];

const attackData = [
  { time: "10:00", normal: 100, attack: 20 },
  { time: "10:05", normal: 200, attack: 100 },
  { time: "10:10", normal: 300, attack: 600 },
];

const geoData = [
  { country: "India", requests: 500 },
  { country: "USA", requests: 300 },
  { country: "Germany", requests: 150 },
];

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Requests" value="12,450" icon="📊" />
          <StatCard title="Blocked IPs" value="342" icon="🚫" color="red" />
          <StatCard title="Active Attacks" value="5" icon="⚠️" color="yellow" />
        </div>

        <AlertBox message="Possible DDoS spike detected on /login" type="danger" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TrafficChart data={trafficData} />
          <AttackGraph data={attackData} />
        </div>

        <GeoMap data={geoData} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;