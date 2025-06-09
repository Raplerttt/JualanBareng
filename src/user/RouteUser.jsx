import React from "react";
import { Routes, Route } from "react-router-dom";
import UserRegistPages from "../pages/UserRegistPages";
import UserLoginPages from "../pages/UserLoginPages";
import UserProfilPages from "../pages/UserProfilPages";
import ProtectedRoute from "../hooks/ProtectedRoute"; // Pastikan path ini benar
import NotFound from "../pages/NotFoundPages";

function UserRoutes() {
  return (
    <Routes>
      <Route path="register" element={<UserRegistPages />} />
      <Route path="login" element={<UserLoginPages />} />
      <Route path="*" element={<NotFound />} />

      {/* Hanya halaman profile yang diproteksi */}
      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<UserProfilPages />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
