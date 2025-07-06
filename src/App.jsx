import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ChatPages from "./pages/ChatPages";
import DetailOrderPages from "./pages/DetailOrderPages";
import DetailStorePages from "./pages/DetailStorePages";
import FavoritePages from "./pages/FavoritePages";
import CartPages from "./pages/CartPages";
import NotFound from "./pages/NotFoundPages";

import UserRoutes from "./user/RouteUser";
import SellerRoutes from "./seller/RouteSeller";

import UseLoading from "./hooks/UseLoading";
import Loading from "./components/Loading";
import { AuthProvider } from "./auth/authContext";
import ProductDetailPages from "./pages/ProductDetailPages";
import CategoryProducts from "./pages/CategoryProduct";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrdersPage from "./pages/OrderPages";
import OrderDetailsPage from "./pages/OrdersDetailPage";
import Login from './admin/Login'
import AdminLayout from "./admin/layout/AdminLayout";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/ResetPassword";

function AppContent() {
  const { isLoading, startLoading, stopLoading } = UseLoading();
  const location = useLocation();

  // Untuk efek loading saat pindah halaman
  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => stopLoading(), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Untuk menyisipkan Midtrans Snap Script
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.REACT_APP_MIDTRANS_KEY// Disarankan pakai process.env.REACT_APP_MIDTRANS_KEY

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPages />} />
        <Route path="/chat" element={<ChatPages />} />
        <Route path="/chat/:sellerId" element={<ChatPages />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order/:orderId" element={<OrderDetailsPage />} />
        <Route path="/checkout-order" element={<DetailOrderPages />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/detail-store/:sellerId" element={<DetailStorePages />} />
        <Route path="/favorite" element={<FavoritePages />} />
        <Route path="/cart" element={<CartPages />} />
        <Route path="/category/products/:categoryId" element={<CategoryProducts />} />

        {/* Nested Routes */}
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/seller/*" element={<SellerRoutes />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
