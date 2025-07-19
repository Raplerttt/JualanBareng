import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import styles for AOS

import Main from "../components/layout/Main";
import Navbar from "../components/layout/NavbarComponents";
import Footer from "../components/layout/FooterComponents";
import ProductHits from "../components/ProdukHits";
import Recommendation from "../components/RecomendedProduct";
import RecommendedCuisine from "../components/RecomendedCuisine";
import RecommendedStore from "../components/RecomendedStore";
import PromoList from "../components/PromoList";

const HomePages = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize AOS animation
    AOS.init({
      duration: 1000, // Optional: adjust the duration of the animations
      once: true, // Optional: make the animation only happen once
      offset: 100, // Optional: add an offset for animations to start a bit earlier
    });

    // Check if user is logged in
    const storedUser  = (localStorage.getItem("Admintoken"));
    if (storedUser ) {
      setUser (storedUser );
    }
  }, []);

  return (
    <>
      <Navbar user={user} />
        {/* Kirim user ke Navbar agar bisa menyesuaikan tampilan */}
        <div data-aos="fade-up">
          <ProductHits />
        </div>
        <div data-aos="fade-up" data-aos-delay="200">
          <Recommendation />
        </div>
        <div data-aos="fade-up" data-aos-delay="400">
          <RecommendedCuisine />
        </div>
        <div data-aos="fade-up" data-aos-delay="600">
          <RecommendedStore />
        </div>
        <div data-aos="fade-up" data-aos-delay="800">
          <PromoList />
        </div>
      <Footer />
    </>
  );
};

export default HomePages;
