import React from "react";
import Main from "../components/Main";
import Navbar from "../components/NavbarComponents";
import RegisterFormUser from "../user/UserRegisterForm";
import Footer from "../components/FooterComponents";

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