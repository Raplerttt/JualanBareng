import React from "react";
import Main from "../components/layout/Main"; // Ensure this file exists in the correct location
import RegisterFormSeller from "../seller/SellerRegisterForm"; // Ensure this file exists in the correct location

const SellerRegistPages = () => {
  return (
    <>
        <RegisterFormSeller /> {/* This is the registration form for seller */}
    </>
  );
};

export default SellerRegistPages;
