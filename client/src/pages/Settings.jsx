import React from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Card title="Project Settings">
          <div className="space-y-3">
            <p><strong>Project Name:</strong> SHIELD</p>
            <p><strong>Protection Mode:</strong> AI + Rule Based</p>
            <p><strong>Rate Limit:</strong> 100 req/min</p>
            <p><strong>Status:</strong> Active</p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;