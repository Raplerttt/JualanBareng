import React from 'react'
import FavoriteComponents from '../components/FavoriteComponents';
import Main from '../components/Main';
import Navbar from '../components/NavbarComponents';
import Footer from '../components/FooterComponents';

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