import React from "react";
import Navbar from "../components/layout/NavbarComponents";
import Footer from "../components/layout/FooterComponents";
import ChangeProfilUser from "../user/ChangeProfilUser";


const UserProfilPages = () => {
  return (
    <>
      <Navbar />
      <ChangeProfilUser />
      <Footer />
    </>
  );
};

export default UserProfilPages;