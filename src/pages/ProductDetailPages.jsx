import React from 'react'
import ProductDetail from '../components/ProductDetail'
import Navbar from '../components/layout/NavbarComponents'
import Footer from '../components/layout/FooterComponents'
import ProductRecommendation from '../components/RecomendedProduct'

const ProductDetailPages = () => {
  return (
    <>
    <Navbar />
    <ProductDetail />
    <ProductRecommendation categoryName="Recomended in Product" />
    <Footer />
    </>
  )
}

export default ProductDetailPages