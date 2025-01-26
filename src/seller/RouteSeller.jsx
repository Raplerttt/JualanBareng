import React from "react";
import { Routes, Route } from "react-router-dom";
import SellerRegistPages from "../pages/SellerRegisterPage";
import SellerLoginPages from "../pages/SellerLoginPage"; // Assuming you have a seller login page
import SellerDashboard from "../pages/DashboardPages";

function SellerRoutes() {
  return (
    <Routes>
      <Route path="register" element={<SellerRegistPages />} />
      <Route path="login" element={<SellerLoginPages />} />
      <Route path="dashboard" element={<SellerDashboard />} />
    </Routes>
  );
}

export default SellerRoutes;
