import React from "react";
import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import Footer from "../components/layout/FooterComponents";
import ProductHits from "../components/ProdukHits";
import Recommendation from "../components/RecomendedProduct";
import RecommendedCausine from "../components/RecomendedCausine";
import RecommendedStore from "../components/RecomendedStore";
import PromoList from "../components/PromoList";

const HomePages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <ProductHits />
      <Recommendation />
      <RecommendedCausine />
      <RecommendedStore  />
      <PromoList />
    </Main>
      <Footer />
    </>
  );
};

export default HomePages;