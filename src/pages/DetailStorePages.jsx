import React from 'react'
import Main from '../components/Main';
import Navbar from '../components/NavbarComponents';
import Footer from '../components/FooterComponents';
import DetailStoreComponents from '../components/DetailStoreComponents';
import ProductRecommendation from '../components/RecomendedProduct';

const DetailStorePages = () => {
    return (
        <>
        <Main>
          <Navbar />
          <DetailStoreComponents />
          <ProductRecommendation categoryName="Recomended in Store"  />
          <ProductRecommendation categoryName="Category Spicy"  />
        </Main>
          <Footer />
        </>
      );
}

export default DetailStorePages