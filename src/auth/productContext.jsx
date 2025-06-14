import React, { createContext, useState, useCallback } from 'react';
import axios from '../../utils/axios'; // Pastikan path ini sesuai dengan struktur proyek Anda

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productCache, setProductCache] = useState({}); // Cache untuk produk berdasarkan ID
  const [lastFetch, setLastFetch] = useState(null); // Waktu fetch terakhir
  const CACHE_DURATION = 5 * 60 * 1000; // Cache valid selama 5 menit

  // Fungsi untuk fetch semua produk
  const fetchProducts = useCallback(async (forceRefresh = false) => {
    // Cek apakah data masih valid di cache
    if (!forceRefresh && products.length > 0 && lastFetch && Date.now() - lastFetch < CACHE_DURATION) {
      console.log('Menggunakan data produk dari cache');
      return products;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/product', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const fetchedProducts = response.data.data || [];
      setProducts(fetchedProducts);
      setLastFetch(Date.now());
      // Update cache untuk produk individual
      const newCache = fetchedProducts.reduce((acc, product) => ({
        ...acc,
        [product.id]: product,
      }), {});
      setProductCache(prev => ({ ...prev, ...newCache }));
      console.log('Produk di-fetch dari server:', fetchedProducts);
      return fetchedProducts;
    } catch (err) {
      console.error('Gagal mengambil produk:', err);
      throw new Error(err.response?.data?.message || 'Gagal memuat produk');
    }
  }, [products, lastFetch]);

  // Fungsi untuk fetch produk berdasarkan ID
  const fetchProductById = useCallback(async (id, forceRefresh = false) => {
    // Cek cache untuk produk individual
    if (!forceRefresh && productCache[id] && lastFetch && Date.now() - lastFetch < CACHE_DURATION) {
      console.log(`Menggunakan data produk ID ${id} dari cache`);
      return productCache[id];
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/product/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const product = response.data.data;
      setProductCache(prev => ({ ...prev, [id]: product }));
      setLastFetch(Date.now());
      console.log(`Produk ID ${id} di-fetch dari server:`, product);
      return product;
    } catch (err) {
      console.error(`Gagal mengambil produk ID ${id}:`, err);
      throw new Error(err.response?.data?.message || 'Gagal memuat produk');
    }
  }, [productCache, lastFetch]);

  // Fungsi untuk membersihkan cache
  const clearCache = useCallback(() => {
    setProducts([]);
    setProductCache({});
    setLastFetch(null);
    console.log('Cache produk dibersihkan');
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      fetchProducts,
      fetchProductById,
      clearCache,
    }}>
      {children}
    </ProductContext.Provider>
  );
};