import React from "react";
import Main from "../components/Main";
import Navbar from "../components/NavbarComponents";
import LoginForm from "../user/UserLoginForm";
import Footer from "../components/FooterComponents";

const LoginPages = () => {
  return (
    <Main>
      <Navbar />
      <div className="bg-gray-100 flex-grow py-8">
        <LoginForm/>
      </div>
      <Footer />
    </Main>
  );
};

export default LoginPages;