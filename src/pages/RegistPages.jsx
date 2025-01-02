import React from "react";
import Main from "../components/Main";
import Navbar from "../components/NavbarComponents";
import RegisterForm from "../user/UserRegisterForm";
import Footer from "../components/FooterComponents";

const RegistPages = () => {
  return (
    <Main>
      <Navbar />
      <div className="bg-gray-100 flex-grow py-8">
        <RegisterForm />
      </div>
      <Footer />
    </Main>
  );
};

export default RegistPages;