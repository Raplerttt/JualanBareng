import React from "react";
import Main from "../components/Main";
import Navbar from "../components/NavbarComponents";
import LoginFormSeller from "../seller/SellerLoginForm";
import Footer from "../components/FooterComponents";

const SellerLoginPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <div className="flex-grow py-8">
        <LoginFormSeller />
      </div>
    </Main>
    <Footer />
    </>
  );
};

export default SellerLoginPages;