import React from "react";
import { Routes, Route } from "react-router-dom";
import UserRegistPages from "../pages/UserRegistPages";
import UserLoginPages from "../pages/UserLoginPages";

function UserRoutes() {
  return (
    <Routes>
      <Route path="register" element={<UserRegistPages />} />
      <Route path="login" element={<UserLoginPages />} />
    </Routes>
  );
}

export default UserRoutes;
