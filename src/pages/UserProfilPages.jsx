import React from "react";
import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import Footer from "../components/layout/FooterComponents";
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