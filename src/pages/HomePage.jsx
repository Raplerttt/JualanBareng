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

    // Cek apakah user sudah login
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <>
      <Main>
        {/* Kirim user ke Navbar agar bisa menyesuaikan tampilan */}
        <Navbar user={user} />
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
      </Main>
      <Footer />
    </>
  );
};

export default HomePages;
