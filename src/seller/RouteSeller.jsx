import React from "react";
import { Routes, Route } from "react-router-dom";
import SellerRegistPages from "../pages/SellerRegisterPage";
import SellerLoginPages from "../pages/SellerLoginPage";
import SellerDashboard from "./pages/DashboardSeller";
import ProtectedSellerRoute from "../hooks/ProtectedRouteSeller";

function SellerRoutes() {
  return (
    <Routes>
      <Route path="register" element={<SellerRegistPages />} />
      <Route path="login" element={<SellerLoginPages />} />
      <Route
        path="dashboard"
        element={
          <ProtectedSellerRoute>
            <SellerDashboard />
          </ProtectedSellerRoute>
        }
      />
    </Routes>
  );
}

export default SellerRoutes;
