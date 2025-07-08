import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaBox, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";


const ProductsSection = ({
  products,
  setProducts,
  setEditProduct,
  setDeleteProductId,
  setIsDeleteModalOpen,
  searchQuery,
  sortBy,
  loading,
  error,
}) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: null,
    categoryId: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const token = localStorage.getItem("Admintoken");
  // Ambil sellerId dari localStorage
  const getSellerId = () => {
    try {
      const token = localStorage.getItem("Admintoken");
      if (!token) return null;
  
      const decoded = jwtDecode(token); // ✅ pakai named import
      return decoded?.id || null;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };
  

  // Fungsi fetch produk ulang
  const fetchProducts = async () => {
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get("/product/my-product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.data || []);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
      // Tidak perlu set error di sini karena error ditangani oleh props
    }
  };

  // Fetch categories saat mount
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) {
        setCategoriesError("Silakan login untuk mengakses kategori.");
        setCategoriesLoading(false);
        return;
      }

      try {
        const response = await axios.get("/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.data || []);
        setCategoriesLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err.response?.data || err.message);
        setCategoriesError("Gagal memuat kategori. Silakan coba lagi.");
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [token]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Silakan login ulang.");
      return;
    }

    const sellerId = getSellerId();
    if (!sellerId) {
      alert("ID penjual tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (
      !newProduct.name?.trim() ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.image ||
      !newProduct.categoryId
    ) {
      alert("Harap isi semua kolom wajib.");
      return;
    }

    if (Number(newProduct.price) <= 0 || Number(newProduct.stock) < 0) {
      alert("Harga harus lebih dari 0 dan stok tidak boleh negatif.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productName", newProduct.name.trim());
      formData.append("price", parseFloat(newProduct.price));
      formData.append("stock", parseInt(newProduct.stock));
      formData.append("image", newProduct.image);
      formData.append("categoryId", parseInt(newProduct.categoryId));
      formData.append("description", newProduct.description?.trim() || "Tidak ada deskripsi");
      formData.append("sellerId", parseInt(sellerId));

      await axios.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch ulang produk
      await fetchProducts();

      // Reset form
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        image: null,
        categoryId: "",
        description: "",
      });

      alert("Produk berhasil ditambahkan!");
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err.message);
      alert(`Gagal menambahkan produk: ${err.response?.data?.message || "Silakan coba lagi."}`);
    }
  };

  const handleImageError = (productId) => {
    setImageError((prev) => ({ ...prev, [productId]: true }));
  };

  const filteredProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        const productName = p.productName || p.name || "";
        return productName.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        const nameA = a.productName || a.name || "";
        const nameB = b.productName || b.name || "";
        if (sortBy === "price") return (a.price || 0) - (b.price || 0);
        if (sortBy === "stock") return (a.stock || 0) - (b.stock || 0);
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "orders") return (b.orders || 0) - (a.orders || 0);
        return nameA.localeCompare(nameB);
      });
  }, [products, searchQuery, sortBy]);

  if (loading) {
    return <div className="text-center py-12">Memuat produk...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaPlus className="mr-2 text-indigo-600" /> Tambah Produk Baru
          </h2>
        </div>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Misalnya, Nasi Goreng"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Misalnya, 25000"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok
              </label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Misalnya, 50"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              {categoriesLoading ? (
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 animate-pulse">
                  Memuat kategori...
                </div>
              ) : categoriesError ? (
                <div className="text-red-500 text-sm">{categoriesError}</div>
              ) : (
                <select
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, categoryId: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Deskripsi produk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Produk
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.files[0] })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Tambah Produk
            </button>
            <button
              type="button"
              onClick={() =>
                setNewProduct({
                  name: "",
                  price: "",
                  stock: "",
                  image: null,
                  categoryId: "",
                  description: "",
                })
              }
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Reset Formulir
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaBox className="mr-2 text-indigo-600" /> Daftar Produk
            <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} item
            </span>
          </h2>
          <div className="text-sm text-gray-500">Menampilkan semua produk</div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-gray-400 mb-4">
              <FaBox className="text-xl" />
            </div>
            <p className="text-gray-500">
              Tidak ada produk ditemukan. Coba kata kunci pencarian lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:3000/${product.image}`}
                      alt={product.productName}
                      className="w-full h-48 object-cover"
                      onError={() => handleImageError(product.id)}
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full shadow-md px-2 py-1 flex items-center text-sm">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-medium">
                        {product.rating || "0"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                      {product.productName}
                    </h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-indigo-600">
                        Rp {product.price?.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stok: {product.stock}
                      </span>
                    </div>
                    <div className="flex mt-auto justify-between items-center">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        aria-label={`Edit produk ${product.productName}`}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteProductId(product.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label={`Hapus produk ${product.productName}`}
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ProductsSection;