import React from "react";
import MainLayout from "../components/layout/MainLayout";
import BlockedIPsTable from "../components/tables/BlockedIPsTable";

const blockedData = [
  { ip: "45.33.21.10", reason: "DDoS suspected", blockedAt: "10:05 AM" },
  { ip: "88.12.54.99", reason: "Rate limit exceeded", blockedAt: "10:08 AM" },
];

const BlockedIPs = () => {
  const handleUnblock = (ip) => {
    alert(`Unblock IP: ${ip}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Blocked IPs</h1>
        <BlockedIPsTable data={blockedData} onUnblock={handleUnblock} />
      </div>
    </MainLayout>
  );
};

export default BlockedIPs;