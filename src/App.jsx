import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import UserRoutes from "./user/RouteUser";
import SellerRoutes from "./seller/RouteSeller";
import HomePage from "./pages/HomePage"; 
import ChatPages from "./pages/ChatPages"; 
import DetailOrderPages from "./pages/DetailOrderPages";
import DetailStorePages from "./pages/DetailStorePages";
import FavoritePages from "./pages/FavoritePages";
import CartPages from "./pages/CartPages";
import NotFound from "./pages/NotFoundPages";
import UseLoading from "./hooks/UseLoading";
import Loading from "./components/Loading"; // Import komponen loading
import { AuthProvider } from "./auth/authContext";
import Navbar from "./components/layout/NavbarComponents"; // Tambahkan Navbar agar selalu terlihat

function AppContent() {
  const { isLoading, startLoading, stopLoading } = UseLoading();
  const location = useLocation();

  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => stopLoading(), 1000);
    
    return () => clearTimeout(timer); // Cleanup effect untuk menghindari memory leak
  }, [location.pathname]);

  return (
    <div>
      {isLoading && <Loading />} {/* Loading ditampilkan jika isLoading true */}
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPages />} />
        <Route path="/detail-order/:id" element={<DetailOrderPages />} />
        <Route path="/detail-store/:id" element={<DetailStorePages />} />
        <Route path="/favorite" element={<FavoritePages />} />
        <Route path="/cart" element={<CartPages />} />

        {/* User Routes */}
        <Route path="user/*" element={<UserRoutes />} />
        
        {/* Seller Routes */}
        <Route path="seller/*" element={<SellerRoutes />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider> {/* AuthProvider harus membungkus seluruh aplikasi */}
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;