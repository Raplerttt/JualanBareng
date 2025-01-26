import React from "react";
import Main from "../components/layout/Main"; // Ensure this file exists in the correct location
import Navbar from "../components/layout/NavbarComponents"; // Ensure this file exists in the correct location
import RegisterFormSeller from "../seller/SellerRegisterForm"; // Ensure this file exists in the correct location
import Footer from "../components/layout/FooterComponents"; // Ensure this file exists in the correct location

const SellerRegistPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <div className="flex-grow py-8">
        <RegisterFormSeller /> {/* This is the registration form for seller */}
      </div>
    </Main>
      <Footer />
    </>
  );
};

export default SellerRegistPages;
