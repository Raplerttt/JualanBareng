import React from 'react'
import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import SellerDashboard from '../seller/DashboardSeller';
import Footer from "../components/layout/FooterComponents";

const DashboardPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <SellerDashboard />
    </Main>
      <Footer />
    </>
  )
}

export default DashboardPages