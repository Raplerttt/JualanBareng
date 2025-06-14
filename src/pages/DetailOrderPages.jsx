import React from 'react'
import Main from '../components/layout/Main';
import Navbar from '../components/layout/NavbarComponents';
import Footer from '../components/layout/FooterComponents';
import CheckoutConfirmation from '../components/DetailOrderComponents';

const DetailOrderPages = () => {
    return (
        <>
        <Main>
          <Navbar />
          <CheckoutConfirmation />
        </Main>
          <Footer />
        </>
      );
}

export default DetailOrderPages