import React, { useState, useContext, useEffect, useRef } from "react";
import { FaHeart, FaCommentDots, FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/authContext";
import axios from "../../../utils/axios";
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
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
  const searchRef = useRef(null);

  // Handler untuk logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/user/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  // Handler untuk pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchDropdownOpen(false);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false); // Tutup menu mobile
    }
  };

  // Fetch kategori saat komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/categories", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCategories(response.data.data || []);
        setCategoryError(null);
      } catch (err) {
        console.error("Gagal mengambil kategori:", err);
        setCategoryError(err.response?.data?.message || "Gagal memuat kategori");
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch hasil pencarian saat mengetik
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearchDropdownOpen(false);
        setSearchError(null);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/product?search=${encodeURIComponent(searchQuery)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setSearchResults(response.data.data || []);
        setIsSearchDropdownOpen(true);
        setSearchError(null);
      } catch (err) {
        console.error("Gagal mengambil hasil pencarian:", err);
        setSearchError(err.response?.data?.message || "Gagal memuat hasil pencarian");
        setSearchResults([]);
        setIsSearchDropdownOpen(true);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 300); // Debounce untuk mengurangi panggilan API
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultImage = "https://via.placeholder.com/150?text=Gambar+Produk";

  return (
    <header className="bg-[#80CBC4] shadow-sm sticky top-0 z-50 border rounded-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo dan Tombol Menu Mobile */}
          <div className="flex items-center">
            <button
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
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
          <div className="hidden md:flex items-center space-x-8">
            {/* Dropdown Kategori */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
              >
                <HiOutlineMenu className="mr-2" />
                Kategori
              </button>
              {isCategoryDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fadeIn"
                  onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                >
                  <div className="py-1">
                    {categoryError ? (
                      <div className="px-4 py-2 text-sm text-red-600">{categoryError}</div>
                    ) : categories.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Tidak ada kategori ditemukan</div>
                    ) : (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-150"
                          onClick={() => {
                            console.log(`Kategori dipilih: ${category.name}`);
                            setIsCategoryDropdownOpen(false);
                            navigate(`/category/${category.name.toLowerCase()}`);
                          }}
                        >
                          {category.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Kolom Pencarian */}
            <div className="relative mx-4 w-64 lg:w-96" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  onFocus={() => searchResults.length > 0 && setIsSearchDropdownOpen(true)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaSearch className="h-4 w-4 text-gray-400 hover:text-indigo-600" />
                </button>
              </form>

              {/* Dropdown Hasil Pencarian */}
              {isSearchDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full max-h-96 overflow-y-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
                  <div className="py-1">
                    {searchError ? (
                      <div className="px-4 py-2 text-sm text-red-600">{searchError}</div>
                    ) : searchResults.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Tidak ada hasil ditemukan</div>
                    ) : (
                      searchResults.map((product) => (
                        <button
                          key={product.id}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-150 flex items-center"
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
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ikon Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => navigate("/favorite")}
            >
              <FaHeart className="h-5 w-5" />
              <span className="sr-only">Favorit</span>
            </button>
            <button
              className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => navigate("/chat")}
            >
              <FaCommentDots className="h-5 w-5" />
              <span className="sr-only">Chat</span>
            </button>
            <button
              className="text-gray-600 hover:text-indigo-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart className="h-5 w-5" />
              <span className="sr-only">Keranjang</span>
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profil Pengguna */}
            {user ? (
              <div className="relative ml-4">
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {user.photo ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        (user.photo
                          ? `http://localhost:3000/uploads/users/${user.photo}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=3B82F6&color=FFFFFF`)
                      }
                      alt="Profil pengguna"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaUser className="h-4 w-4 text-indigo-600" />
                    </div>
                  )}
                </button>
                {isUserDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fadeIn">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/user/profile");
                          setIsUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profil Anda
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-red-600"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <button
                  onClick={() => navigate("/user/login")}
                  className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors duration-200"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate("/user/register")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          {/* Ikon Keranjang Mobile */}
          <button
            className="md:hidden text-gray-600 relative p-2"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full z-40 animate-slideDown">
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
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onFocus={() => searchResults.length > 0 && setIsSearchDropdownOpen(true)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaSearch className="h-4 w-4 text-gray-400 hover:text-indigo-600" />
                </button>
              </form>
              {/* Dropdown Hasil Pencarian Mobile */}
              {isSearchDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full max-h-96 overflow-y-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
                  <div className="py-1">
                    {searchError ? (
                      <div className="px-4 py-2 text-sm text-red-600">{searchError}</div>
                    ) : searchResults.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Tidak ada hasil ditemukan</div>
                    ) : (
                      searchResults.map((product) => (
                        <button
                          key={product.id}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-150 flex items-center"
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
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Kategori */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                Kategori
              </h3>
              <div className="space-y-1">
                {categoryError ? (
                  <div className="px-4 py-2 text-sm text-red-600">{categoryError}</div>
                ) : categories.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Tidak ada kategori ditemukan</div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                      onClick={() => {
                        console.log(`Kategori dipilih: ${category.name}`);
                        navigate(`/category/${category.name.toLowerCase()}`);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Item Menu */}
            <div className="pt-2">
              <button
                onClick={() => {
                  navigate("/favorite");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
              >
                Favorit
              </button>
              <button
                onClick={() => {
                  navigate("/chat");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
              >
                Chat
              </button>
            </div>

            {/* Tombol Autentikasi */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <>
                  <div className="flex items-center px-3 py-2">
                    {user.profilePicture ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover mr-3"
                        src={user.profilePicture}
                        alt="Profil pengguna"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaUser className="h-5 w-5 text-indigo-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name || user.email}</p>
                      <p className="text-xs text-gray-500">Lihat profil</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 mt-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/user/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-150"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => {
                      navigate("/user/register");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors duration-150"
                  >
                    Daftar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;