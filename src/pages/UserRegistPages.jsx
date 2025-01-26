import React from "react";
import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import RegisterFormUser from "../user/UserRegisterForm";
import Footer from "../components/layout/FooterComponents";

const UserRegistPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <div className="flex-grow py-8">
        <RegisterFormUser />
      </div>
    </Main>
      <Footer />
    </>
  );
};

export default UserRegistPages;