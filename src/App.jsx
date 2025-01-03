import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./user/RouteUser";
import SellerRoutes from "./seller/RouteSeller";
import HomePage from "./pages/HomePage"; // Assuming it's your homepage

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />

        {/* User-related Pages */}
        <Route path="user/*" element={<UserRoutes />} />

        {/* Seller-related Pages */}
        <Route path="seller/*" element={<SellerRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
