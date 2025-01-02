import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistPages from "./pages/RegistPages";
import LoginPages from "./pages/LoginPages";
import HomePage from "./pages/HomePage"; // Ganti dengan halaman lain yang Anda punya

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman utama */}
        <Route path="/" element={<HomePage />} />
        
        {/* Halaman registrasi */}
        <Route path="/register" element={<RegistPages />} />
        <Route path="/login" element={<LoginPages />} />
      </Routes>
    </Router>
  );
}

export default App;
