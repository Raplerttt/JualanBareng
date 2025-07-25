import React from 'react'
import Main from '../components/layout/Main';
import Navbar from '../components/layout/NavbarComponents';
import Footer from '../components/layout/FooterComponents';
import DetailStoreComponents from '../components/DetailStoreComponents';
import ProductRecommendation from '../components/RecomendedProduct';

const DetailStorePages = () => {
    return (
        <>
        <Main>
          <Navbar />
          <DetailStoreComponents />
        </Main>
          <Footer />
        </>
      );
}

export default DetailStorePages