import React from "react";
import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import LoginFormSeller from "../seller/SellerLoginForm";
import Footer from "../components/layout/FooterComponents";

const SellerLoginPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <div className="flex-grow py-32">
        <LoginFormSeller />
      </div>
    </Main>
    <Footer />
    </>
  );
};

export default SellerLoginPages;