import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Dashboard from "../pages/Dashboard";
import Traffic from "../pages/Traffic";
import Attacks from "../pages/Attacks";
import BlockedIPs from "../pages/BlockedIPs";
import ApiKeys from "../pages/ApiKeys";
import Settings from "../pages/Settings";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/traffic"
        element={
          <ProtectedRoute>
            <Traffic />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attacks"
        element={
          <ProtectedRoute>
            <Attacks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blocked"
        element={
          <ProtectedRoute>
            <BlockedIPs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apikeys"
        element={
          <ProtectedRoute>
            <ApiKeys />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;