import React from "react";
import { Routes, Route } from "react-router-dom";

// Import halaman
import Dashboard from "../AdminDashboard";
import BugReports from "../BugReports";
import FraudCases from "../FraudCases";
import Analytics from "../SystemAnalytics";
import Settings from "../Setting";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/bug-reports" element={<BugReports />} />
      <Route path="/fraud-cases" element={<FraudCases />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AdminRoutes;
