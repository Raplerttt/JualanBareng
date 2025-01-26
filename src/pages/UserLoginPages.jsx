import React from "react";
import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import LoginFormUser from "../user/UserLoginForm";
import Footer from "../components/layout/FooterComponents";

const UserLoginPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <div className="flex-grow py-32">
        <LoginFormUser/>
      </div>
    </Main>
      <Footer />
    </>
  );
};

export default UserLoginPages;