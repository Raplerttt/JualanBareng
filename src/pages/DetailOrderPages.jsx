import React from 'react'
import Main from '../components/Main';
import DetailOrderComponents from '../components/DetailOrderComponents';
import Navbar from '../components/NavbarComponents';
import Footer from '../components/FooterComponents';

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