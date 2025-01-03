import React from 'react'
import CartComponent from '../components/CartComponent'
import Main from '../components/Main'
import Navbar from '../components/NavbarComponents'
import Footer from '../components/FooterComponents'

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