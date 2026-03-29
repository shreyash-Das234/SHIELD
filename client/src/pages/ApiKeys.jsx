import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const ApiKeys = () => {
  const [apiKey, setApiKey] = useState("shd_1234567890abcdef");

  const generateKey = () => {
    const newKey = "shd_" + Math.random().toString(36).substring(2, 18);
    setApiKey(newKey);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">API Keys</h1>

        <Card title="Your Website API Key">
          <div className="space-y-4">
            <p className="bg-gray-100 p-3 rounded-lg font-mono break-all">{apiKey}</p>
            <Button onClick={generateKey}>Generate New Key</Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ApiKeys;