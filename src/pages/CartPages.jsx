import React from 'react'
import CartComponent from '../components/CartComponent'
import Main from '../components/layout/Main'
import Navbar from '../components/layout/NavbarComponents'
import Footer from '../components/layout/FooterComponents'

const CartPages = () => {
  return (
    <>
    <Main>
      <Navbar />
      <CartComponent />
    </Main>
      <Footer />
    </>
  )
}

export default CartPages;