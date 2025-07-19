import React, { useState, useContext, useEffect, useRef } from "react";
import { FaHeart, FaCommentDots, FaShoppingCart, FaSearch, FaUser, FaClipboardList, FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../auth/authContext";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { user, token, isAuthenticated, isLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const categoryRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);

  // Handler untuk logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil keluar");
      navigate("/user/login");
    } catch (error) {
      toast.error("Gagal keluar: " + (error.message || "Kesalahan tidak diketahui"));
    }
  };

  // Handler untuk pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchDropdownOpen(false);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  // Fetch jumlah item di keranjang
  useEffect(() => {
    const fetchCartData = async () => {
      if (!isAuthenticated || !token || isLoading) {
        setCartCount(0);
        return;
      }

      setIsCartLoading(true);
      try {
        const response = await axios.get('/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success && response.data.data?.CartItems) {
          const count = response.data.data.CartItems.reduce(
            (sum, item) => sum + (item.quantity || 1),
            0
          );
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartCount(0);
        toast.error("Gagal memuat data keranjang");
      } finally {
        setIsCartLoading(false);
      }
    };

    fetchCartData();
  }, [isAuthenticated, token, isLoading]);

  // Fetch kategori
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get("/categories", { headers });
        setCategories(response.data.data || []);
        setCategoryError(null);
      } catch (err) {
        setCategoryError(err.response?.data?.message || "Gagal memuat kategori");
        setCategories([]);
        toast.error("Gagal memuat kategori");
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  // Fetch hasil pencarian
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearchDropdownOpen(false);
        setSearchError(null);
        return;
      }

      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`/product?search=${encodeURIComponent(searchQuery)}`, { headers });
        setSearchResults(response.data.data || []);
        setIsSearchDropdownOpen(true);
        setSearchError(null);
      } catch (err) {
        setSearchError(err.response?.data?.message || "Gagal memuat hasil pencarian");
        setSearchResults([]);
        setIsSearchDropdownOpen(true);
        toast.error("Gagal memuat hasil pencarian");
      }
    };

    const debounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, token]);

  // Click outside untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultImage = "https://via.placeholder.com/150?text=Gambar+Produk";

  return (
    <header className="bg-[#80CBC4] shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo dan Tombol Menu Mobile */}
          <div className="flex items-center">
            <button
              className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
            </button>
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="Logo" className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-800 hidden sm:block">Jualan Bareng</span>
            </div>
          </div>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Dropdown Kategori */}
            <div className="relative" ref={categoryRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              >
                <HiOutlineMenu className="mr-2 h-5 w-5" />
                Kategori
              </motion.button>
              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1">
                      {isCategoriesLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Memuat kategori...</div>
                      ) : categoryError ? (
                        <div className="px-4 py-2 text-sm text-red-600">{categoryError}</div>
                      ) : categories.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Tidak ada kategori ditemukan</div>
                      ) : (
                        categories.map((category) => (
                          <motion.button
                            key={category.id}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150"
                            onClick={() => {
                              setIsCategoryDropdownOpen(false);
                              navigate(`/category/products/${category.id}`);
                            }}
                          >
                            {category.name}
                          </motion.button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Kolom Pencarian */}
            <div className="relative w-64 lg:w-96" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  onFocus={() => searchResults.length > 0 && setIsSearchDropdownOpen(true)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaSearch className="h-4 w-4 text-gray-400 hover:text-indigo-600" />
                </button>
              </form>
              <AnimatePresence>
                {isSearchDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-full max-h-96 overflow-y-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1">
                      {searchError ? (
                        <div className="px-4 py-2 text-sm text-red-600">{searchError}</div>
                      ) : searchResults.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Tidak ada hasil ditemukan</div>
                      ) : (
                        searchResults.map((product) => (
                          <motion.button
                            key={product.id}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150 flex items-center"
                            onClick={() => {
                              setIsSearchDropdownOpen(false);
                              navigate(`/product/${product.id}`);
                              setSearchQuery("");
                            }}
                          >
                            <img
                              src={product.image ? `http://localhost:3000/${product.image}` : defaultImage}
                              alt={product.name || product.productName}
                              className="w-10 h-10 object-cover rounded mr-3"
                              onError={(e) => (e.target.src = defaultImage)}
                            />
                            <div>
                              <p className="font-medium">{product.name || product.productName}</p>
                              <p className="text-xs text-gray-500">
                                Rp {product.price?.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ikon Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && !isLoading && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => navigate("/favorite")}
                >
                  <FaHeart className="h-5 w-5" />
                  <span className="sr-only">Favorit</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => navigate("/chat")}
                >
                  <FaCommentDots className="h-5 w-5" />
                  <span className="sr-only">Chat</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => navigate("/cart")}
                >
                  <FaShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Keranjang</span>
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {isCartLoading ? "..." : cartCount}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => navigate("/orders")}
                >
                  <FaClipboardList className="h-5 w-5" />
                  <span className="sr-only">Pesanan</span>
                </motion.button>
                {user?.role === 'SELLER' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => navigate("/reports")}
                  >
                    <FaExclamationTriangle className="h-5 w-5" />
                    <span className="sr-only">Laporan</span>
                  </motion.button>
                )}
              </>
            )}

            {/* Profil Pengguna */}
            <div className="relative" ref={userRef}>
              {isAuthenticated && !isLoading ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {user?.photo ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        user.photo
                          ? `http://localhost:3000/${user.photo}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email || "User")}&background=3B82F6&color=FFFFFF`
                      }
                      alt="Profil pengguna"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaUser className="h-4 w-4 text-indigo-600" />
                    </div>
                  )}
                </motion.button>
              ) : (
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/user/login")}
                    className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors duration-200"
                  >
                    Masuk
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/user/register")}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Daftar
                  </motion.button>
                </div>
              )}
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1">
                      <motion.button
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        onClick={() => {
                          navigate("/user/profile");
                          setIsUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                      >
                        Profil Anda
                      </motion.button>
                      {user?.role === 'SELLER' && (
                        <motion.button
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          onClick={() => {
                            navigate("/reports");
                            setIsUserDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                        >
                          Laporan
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Keluar
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ikon Keranjang Mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="md:hidden text-gray-600 relative p-2"
            onClick={() => {
              navigate("/cart");
              setIsMobileMenuOpen(false);
            }}
          >
            <FaShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {isCartLoading ? "..." : cartCount}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white shadow-lg absolute w-full z-40"
          >
            <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6">
              {/* Pencarian Mobile */}
              <div className="relative mt-2 mb-4" ref={searchRef}>
                <form onSubmit={handleSearch}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    onFocus={() => searchResults.length > 0 && setIsSearchDropdownOpen(true)}
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaSearch className="h-4 w-4 text-gray-400 hover:text-indigo-600" />
                  </button>
                </form>
                <AnimatePresence>
                  {isSearchDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-full max-h-96 overflow-y-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        {searchError ? (
                          <div className="px-4 py-2 text-sm text-red-600">{searchError}</div>
                        ) : searchResults.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-500">Tidak ada hasil ditemukan</div>
                        ) : (
                          searchResults.map((product) => (
                            <motion.button
                              key={product.id}
                              whileHover={{ backgroundColor: '#f3f4f6' }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150 flex items-center"
                              onClick={() => {
                                setIsSearchDropdownOpen(false);
                                navigate(`/product/${product.id}`);
                                setSearchQuery("");
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <img
                                src={product.image ? `http://localhost:3000/${product.image}` : defaultImage}
                                alt={product.name || product.productName}
                                className="w-10 h-10 object-cover rounded mr-3"
                                onError={(e) => (e.target.src = defaultImage)}
                              />
                              <div>
                                <p className="font-medium">{product.name || product.productName}</p>
                                <p className="text-xs text-gray-500">
                                  Rp {product.price?.toLocaleString("id-ID")}
                                </p>
                              </div>
                            </motion.button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Kategori */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  Kategori
                </h3>
                <div className="space-y-1">
                  {isCategoriesLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Memuat kategori...</div>
                  ) : categoryError ? (
                    <div className="px-4 py-2 text-sm text-red-600">{categoryError}</div>
                  ) : categories.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Tidak ada kategori ditemukan</div>
                  ) : (
                    categories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                        onClick={() => {
                          navigate(`/category/products/${category.id}`);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {category.name}
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              {/* Item Menu */}
              <div className="pt-2">
                {isAuthenticated && !isLoading && (
                  <>
                    <motion.button
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        navigate("/favorite");
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                    >
                      Favorit
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        navigate("/chat");
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                    >
                      Chat
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        navigate("/orders");
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                    >
                      Pesanan
                    </motion.button>
                    {user?.role === 'SELLER' && (
                      <motion.button
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        onClick={() => {
                          navigate("/reports");
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                      >
                        Laporan
                      </motion.button>
                    )}
                  </>
                )}
              </div>

              {/* Tombol Autentikasi */}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated && !isLoading ? (
                  <>
                    <div className="flex items-center px-3 py-2">
                      {user?.photo ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover mr-3"
                          src={
                            user.photo
                              ? `http://localhost:3000/uploads/users/${user.photo}`
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email || "User")}&background=3B82F6&color=FFFFFF`
                          }
                          alt="Profil pengguna"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <FaUser className="h-5 w-5 text-indigo-600" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.fullName || user.email}</p>
                        <p className="text-xs text-gray-500">Lihat profil</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ backgroundColor: '#fef2f2' }}
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                    >
                      Keluar
                    </motion.button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ backgroundColor: '#e0e7ff' }}
                      onClick={() => {
                        navigate("/user/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-150"
                    >
                      Masuk
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: '#4f46e5' }}
                      onClick={() => {
                        navigate("/user/register");
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors duration-150"
                    >
                      Daftar
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;