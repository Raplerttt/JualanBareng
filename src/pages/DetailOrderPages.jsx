import React from 'react'
import Main from '../components/layout/Main';
import DetailOrderComponents from '../components/DetailOrderComponents';
import Navbar from '../components/layout/NavbarComponents';
import Footer from '../components/layout/FooterComponents';

const DetailOrderPages = () => {
    return (
        <>
        <Main>
          <Navbar />
          <DetailOrderComponents />
        </Main>
          <Footer />
        </>
      );
}

export default DetailOrderPages