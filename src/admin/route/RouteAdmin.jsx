import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "../AdminDashboard";
import BugReports from "../BugReports";
import FraudCases from "../FraudCases";
import Settings from "../Setting";
import VerifikasiPendaftaran from "../VerifikasiPendaftaran";
import PencairanDana from "../PencairanDana";
import DetailPencairanDana from "../DetailPencairanDana";

function AdminRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="bug-reports"
        element={
          <ProtectedRoute>
            <BugReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="fraud-cases"
        element={
          <ProtectedRoute>
            <FraudCases />
          </ProtectedRoute>
        }
      />
      <Route
        path="settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="verifikasi-pendaftaran"
        element={
          <ProtectedRoute>
            <VerifikasiPendaftaran />
          </ProtectedRoute>
        }
      />
      <Route
        path="escrow-to-seller"
        element={
          <ProtectedRoute>
            <PencairanDana />
          </ProtectedRoute>
        }
      />
      <Route
        path="escrow-to-seller/:id"
        element={
          <ProtectedRoute>
            <DetailPencairanDana />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AdminRoutes;
