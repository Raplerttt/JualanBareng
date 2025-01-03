import React from "react";
import { Routes, Route } from "react-router-dom";
import UserRegistPages from "../pages/UserRegistPages";
import UserLoginPages from "../pages/UserLoginPages";
import UserProfilPages from "../pages/UserProfilPages";

function UserRoutes() {
  return (
    <Routes>
      <Route path="register" element={<UserRegistPages />} />
      <Route path="login" element={<UserLoginPages />} />
      <Route path="profil" element={<UserProfilPages />} />
    </Routes>
  );
}

export default UserRoutes;
