import React from "react";
import Main from "../components/Main";
import Navbar from "../components/NavbarComponents";
import LoginFormUser from "../user/UserLoginForm";
import Footer from "../components/FooterComponents";

const UserLoginPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <div className="flex-grow py-8">
        <LoginFormUser/>
      </div>
    </Main>
      <Footer />
    </>
  );
};

export default UserLoginPages;