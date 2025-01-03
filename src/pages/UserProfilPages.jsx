import React from "react";
import Main from "../components/Main";
import Navbar from "../components/NavbarComponents";
import Footer from "../components/FooterComponents";
import ChangeProfilUser from "../user/ChangeProfilUser";


const UserProfilPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <ChangeProfilUser />
    </Main>
      <Footer />
    </>
  );
};

export default UserProfilPages;