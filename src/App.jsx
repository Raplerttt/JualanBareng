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
import UseLoading from "./hooks/UseLoading"
import Loading from "./components/Loading"; // Import komponen loading

function AppContent() {
  const { isLoading, startLoading, stopLoading } = UseLoading();
  const location = useLocation(); // Untuk mendeteksi perubahan halaman

  useEffect(() => {
    startLoading(); // Tampilkan loading saat halaman berubah
    setTimeout(() => stopLoading(), 1000); // Simulasikan loading selama 1 detik
  }, [location.pathname]);

  return (
    <div>
      {isLoading && <Loading />} {/* Tampilkan loading jika isLoading true */}
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPages />} />
        <Route path="/detail-order" element={<DetailOrderPages />} />
        <Route path="/detail-store" element={<DetailStorePages />} />
        <Route path="/favorite" element={<FavoritePages />} />
        <Route path="/cart" element={<CartPages />} />

        {/* User-related Pages */}
        <Route path="user/*" element={<UserRoutes />} />
        
        {/* Seller-related Pages */}
        <Route path="seller/*" element={<SellerRoutes />} />

        {/* 404 Notfound */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
