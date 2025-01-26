import React from 'react'
import FavoriteComponents from '../components/FavoriteComponents';
import Main from '../components/layout/Main';
import Navbar from '../components/layout/NavbarComponents';
import Footer from '../components/layout/FooterComponents';

const FavoritePages = () => {
    return (
        <>
        <Main>
          <Navbar />
          <FavoriteComponents/>
        </Main>
          <Footer />
        </>
      );
}

export default FavoritePages