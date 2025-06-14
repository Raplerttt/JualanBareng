import React from 'react'
import Main from '../components/layout/Main'
import ProductDetail from '../components/ProductDetail'
import Navbar from '../components/layout/NavbarComponents'
import Footer from '../components/layout/FooterComponents'
import ProductRecommendation from '../components/RecomendedProduct'

const ProductDetailPages = () => {
  return (
    <>
    <Main >
    <Navbar />
    <ProductDetail />
    <ProductRecommendation categoryName="Recomended in Product" />
    <Footer />
    </Main>
    </>
  )
}

export default ProductDetailPages