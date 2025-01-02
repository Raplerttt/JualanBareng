import React from "react";
import Main from "../components/Main";
import Navbar from "../components/NavbarComponents";
import Footer from "../components/FooterComponents";
import ProductHits from "../components/ProdukHits";
import Recommendation from "../components/RecomendedProduct";
import RecommendedCausine from "../components/RecomendedCausine";
import RecommendedStore from "../components/RecomendedStore";

const HomePages = () => {
  return (
    <Main>
      <Navbar />
      <ProductHits />
      <Recommendation />
      <RecommendedCausine />
      <RecommendedStore />
      <Footer />
    </Main>
  );
};

export default HomePages;