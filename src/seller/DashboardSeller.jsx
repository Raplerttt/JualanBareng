import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaBox, FaChartLine, FaStore, FaHome, FaList, FaUsers, FaCog, FaSignOutAlt, FaStar, FaSearch, FaTimes, FaTicketAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../utils/axios"; // Adjust the path as necessary

// Products Component
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
  const token = localStorage.getItem("Sellertoken");
  console.log("Token:", token);

  // Fungsi fetch produk ulang
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("Sellertoken"); // ✅ Tambahkan ini
  
      const response = await axios.get("/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setProducts(response.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  

  // Fetch categories saat mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.data);
        setCategoriesLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoriesError("Failed to load categories");
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.image ||
      !newProduct.categoryId
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productName", newProduct.name);
      formData.append("price", parseFloat(newProduct.price));
      formData.append("stock", parseInt(newProduct.stock));
      formData.append("image", newProduct.image);
      formData.append("categoryId", parseInt(newProduct.categoryId));
      formData.append("description", newProduct.description || "No description");
      formData.append("sellerId", parseInt("1")); // Ganti sesuai seller ID dinamis

      await axios.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("Sellertoken")}`,
        },
      });

      // Fetch ulang produk supaya update list otomatis
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

      alert("Product added successfully!");
    } catch (err) {
      console.error("Error adding product:", err);
      if (err.response) {
        alert(`Error: ${err.response.data.message || "Failed to add product"}`);
      } else {
        alert("Failed to add product. Please try again.");
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const filteredProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        const productName = p.name || p.productName || "";
        return productName.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        const nameA = a.name || a.productName || "";
        const nameB = b.name || b.productName || "";

        if (sortBy === "price") return (a.price || 0) - (b.price || 0);
        if (sortBy === "stock") return (a.stock || 0) - (b.stock || 0);
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "orders") return (b.orders || 0) - (a.orders || 0);
        return nameA.localeCompare(nameB);
      });
  }, [products, searchQuery, sortBy]);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
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
            <FaPlus className="mr-2 text-indigo-600" /> Add New Product
          </h2>
        </div>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g., Nasi Goreng"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g., 25000"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g., 50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              {categoriesLoading ? (
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 animate-pulse">
                  Loading categories...
                </div>
              ) : categoriesError ? (
                <div className="text-red-500 text-sm">{categoriesError}</div>
              ) : (
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Product description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
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
              Add Product
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
              Reset Form
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
            <FaBox className="mr-2 text-indigo-600" /> Product List
            <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} items
            </span>
          </h2>
          <div className="text-sm text-gray-500">Showing all products</div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-gray-400 mb-4">
              <FaBox className="text-xl" />
            </div>
            <p className="text-gray-500">No products found. Try a different search term.</p>
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
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full shadow-md px-2 py-1 flex items-center text-sm">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-medium">{product.rating || "0"}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{product.productName}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-indigo-600">
                        Rp {product.price?.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <div className="flex mt-auto justify-between items-center">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        aria-label={`Edit product ${product.productName}`}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteProductId(product.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label={`Delete product ${product.productName}`}
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

// Orders Component
const OrdersSection = ({ orders = [], searchQuery = '', sortBy, loading, error }) => {
  // Filter orders dengan pengecekan yang lebih aman
  const filteredOrders = orders
    .filter((order) => {
      const searchTerm = searchQuery.toLowerCase();
      const user = order.user?.name || '';
      const seller = order.seller?.name || '';
      const address = order.deliveryAddress || '';
      
      return (
        user.toLowerCase().includes(searchTerm) ||
        seller.toLowerCase().includes(searchTerm) ||
        address.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (sortBy === "total") return (a.totalAmount || 0) - (b.totalAmount || 0);
      if (sortBy === "date") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return new Date(a.createdAt) - new Date(b.createdAt); // Default sort by date
    });

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  // Format status untuk tampilan yang lebih baik
  const formatStatus = (status) => {
    switch(status) {
      case 'PENDING': return 'Pending';
      case 'PROCESSING': return 'Processing';
      case 'SHIPPED': return 'Shipped';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaList className="mr-2 text-indigo-600" /> Order List
          <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
            {filteredOrders.length} items
          </span>
        </h2>
        <div className="text-sm text-gray-500">Showing all orders</div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-gray-400 mb-4">
            <FaList className="text-xl" />
          </div>
          <p className="text-gray-500">No orders found. Try a different search term.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.fullName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp {order.totalAmount?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {order.deliveryAddress || 'No address'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

// Settings Component
const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState('voucher');
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    type: 'Persentase',
    value: 0,
    minPurchase: 0,
    startDate: '',
    endDate: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [storeName, setStoreName] = useState("Restoran Padang Sederhana");
  const [storeDesc, setStoreDesc] = useState("Manage your culinary business");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeInstagram, setStoreInstagram] = useState("");
  const [storeFacebook, setStoreFacebook] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("Sellertoken");

  const fetchVouchers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/vouchers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVouchers(response.data.data);
    } catch (err) {
      setError("Failed to load vouchers. Please try again.");
      console.error("Error fetching vouchers:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Panggil fetch vouchers pertama kali saat komponen mount
  useEffect(() => {
    fetchVouchers();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher({ ...newVoucher, [name]: value });
  };

  const addVoucher = async () => {
    const token = localStorage.getItem("Sellertoken");
  
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }
  
    const voucherType = newVoucher.type ? newVoucher.type.toUpperCase() : "PERSENTASE";
  
    if (
      !newVoucher.name?.trim() ||
      !newVoucher.code?.trim() ||
      !voucherType ||
      !newVoucher.expiryAt ||
      isNaN(Date.parse(newVoucher.expiryAt)) ||
      !(Number(newVoucher.discount) >= 0.01) ||
      !(Number(newVoucher.minPurchase) >= 0)
    ) {
      alert("Harap isi semua kolom wajib dengan benar!");
      return;
    }
  
    const payload = {
      name: newVoucher.name.trim(),
      code: newVoucher.code.trim(),
      type: voucherType,
      discount: Number(newVoucher.discount),
      minPurchase: Number(newVoucher.minPurchase),
      usageCount: 0,
      status: true,
      expiryAt: new Date(newVoucher.expiryAt).toISOString(),
    };
  
    try {
      const response = await axios.post("/vouchers", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        
      });
  
      const addedVoucher = response.data;
      setVouchers([...vouchers, addedVoucher]);
      setNewVoucher({
        name: '',
        code: '',
        type: 'PERSENTASE',
        discount: 0,
        minPurchase: 0,
        expiryAt: '',
      });
      fetchVouchers()
      setShowForm(false);
    } catch (error) {
      console.error("Error saat menambahkan voucher:", error.response || error);
      alert("Gagal menambahkan voucher. Periksa kembali data Anda.");
    }
  };
  
  const toggleVoucherStatus = async (id) => {
    try {
      const voucher = vouchers.find(v => v.id === id);
      const response = await axios.put(`/vouchers/${id}`, {
        headers: { "Content-Type": "application/json",
          Authorization : `Bearer ${token}`
         },
        body: JSON.stringify({ status: !voucher.status }),
      });
      if (!response.ok) throw new Error("Failed to update voucher status");
      setVouchers(vouchers.map(v =>
        v.id === id ? { ...v, status: !v.status } : v
      ));
    } catch (err) {
      console.error("Error updating voucher status:", err);
      alert("Failed to update voucher status. Please try again.");
    }
  };

  const deleteVoucher = async (id) => {
    try {
      const response = await axios.delete(`/vouchers/${id}`, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete voucher");
      setVouchers(vouchers.filter(voucher => voucher.id !== id));
    } catch (err) {
      console.error("Error deleting voucher:", err);
      alert("Failed to delete voucher. Please try again.");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          storeDesc,
          storeAddress,
          storeEmail,
          storePhone,
          storeInstagram,
          storeFacebook,
          notifications,
          showOutOfStock,
        }),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaCog className="mr-2 text-indigo-600" /> Pengaturan
        </h2>
        <div className="text-sm text-gray-500">Customize your store</div>
      </div>
      
      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-4">
          <button
            className={`pb-3 px-4 ${activeTab === 'voucher' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('voucher')}
          >
            <FaTicketAlt className="inline mr-2" /> Voucher Diskon
          </button>
          <button
            className={`pb-3 px-4 ${activeTab === 'general' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('general')}
          >
            <FaCog className="inline mr-2" /> Pengaturan Umum
          </button>
        </div>
      </div>

      {/* Voucher Tab */}
      {activeTab === 'voucher' && (
        <div>
          <div className="flex justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Manajemen Voucher</h3>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => setShowForm(!showForm)}
            >
              <FaPlus className="mr-2" /> Buat Voucher Baru
            </button>
          </div>

{/* Voucher Form */}
{showForm && (
  <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
    <h4 className="text-lg font-medium text-gray-800 mb-4">Buat Voucher Baru</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Nama Voucher */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Voucher*</label>
        <input
          type="text"
          name="name"
          value={newVoucher.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Promo Musim Panas"
          required
        />
      </div>

      {/* Kode Voucher */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Voucher*</label>
        <input
          type="text"
          name="code"
          value={newVoucher.code}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="SUMMER25"
          required
        />
      </div>

      {/* Jenis Diskon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Diskon*</label>
        <select
          name="type"
          value={newVoucher.type}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
        >
          <option value="PERSENTASE">Persentase (%)</option>
          <option value="NOMINAL">Nominal (Rp)</option>
        </select>
      </div>

      {/* Diskon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {newVoucher.type === "PERSENTASE" ? "Diskon (%) *" : "Diskon (Rp) *"}
        </label>
        <input
          type="number"
          name="discount"
          value={newVoucher.discount}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          min={newVoucher.type === "PERSENTASE" ? 0 : 0}
          max={newVoucher.type === "PERSENTASE" ? 100 : undefined}
          placeholder={newVoucher.type === "PERSENTASE" ? "25" : "50000"}
          required
        />
      </div>

      {/* Minimal Pembelian */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Pembelian (Rp)</label>
        <input
          type="number"
          name="minPurchase"
          value={newVoucher.minPurchase}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="0"
          min={0}
        />
      </div>

      {/* Tanggal Mulai */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai*</label>
        <input
          type="date"
          name="startDate"
          value={newVoucher.startDate}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
        />
      </div>

      {/* Tanggal Berakhir */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir*</label>
        <input
          type="date"
          name="expiryAt"
          value={newVoucher.expiryAt}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
        />
      </div>
    </div>

    {/* Tombol aksi */}
    <div className="mt-6 flex justify-end space-x-3">
      <button
        type="button"
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
        onClick={() => setShowForm(false)}
      >
        Batal
      </button>
      <button
        type="button"
        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        onClick={addVoucher}
      >
        Simpan Voucher
      </button>
    </div>
  </div>
)}



{/* Voucher List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Kode</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Jenis</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Nilai</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Min. Belanja</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Periode</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Penggunaan</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(vouchers) && vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <tr key={voucher.id || Math.random()} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {voucher.code || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {voucher.type || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {voucher.type === 'PERSENTASE'
                        ? `${Number(voucher.discount) || 0}%`
                        : `Rp ${(Number(voucher.discount) || 0).toLocaleString('id-ID')}`}
                    </td>
                      
                    <td className="py-3 px-4 text-gray-600">
                      {(Number(voucher.minPurchase) || 0) > 0
                        ? `Rp ${Number(voucher.minPurchase).toLocaleString('id-ID')}`
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
          {voucher.createdAt
            ? new Date(voucher.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '-'} s/d {' '}
          {voucher.expiryAt
            ? new Date(voucher.expiryAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '-'}
        </td>
                    <td className="py-3 px-4 text-gray-600">
                      {voucher.usage ?? 0}x
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          voucher.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {voucher.status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="text-yellow-500 hover:text-yellow-700 mr-3"
                        onClick={() => toggleVoucherStatus(voucher.id)}
                      >
                        {voucher.status ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteVoucher(voucher.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    Tidak ada voucher yang tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        </div>
      )}

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Pengaturan Umum Toko</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Informasi Toko</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko*</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nama Toko Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Toko</label>
                  <textarea
                    value={storeDesc}
                    onChange={(e) => setStoreDesc(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Deskripsi singkat tentang toko Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    rows="2"
                    placeholder="Alamat lengkap toko"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Kontak</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="contact@tokoanda.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="08123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Media Sosial</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={storeInstagram}
                      onChange={(e) => setStoreInstagram(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Instagram"
                    />
                    <input
                      type="text"
                      value={storeFacebook}
                      onChange={(e) => setStoreFacebook(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Facebook"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Pengaturan Lainnya</h4>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="text-gray-700">
                Aktifkan notifikasi email untuk pesanan baru
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="inventory"
                checked={showOutOfStock}
                onChange={(e) => setShowOutOfStock(e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="inventory" className="text-gray-700">
                Tampilkan produk yang habis stok
              </label>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={() => {
                setStoreName("Restoran Padang Sederhana");
                setStoreDesc("Manage your culinary business");
                setStoreAddress("");
                setStoreEmail("");
                setStorePhone("");
                setStoreInstagram("");
                setStoreFacebook("");
                setNotifications(false);
                setShowOutOfStock(false);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Batal
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Main SellerDashboard Component
const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState({ products: true, orders: true, customers: true });
  const [error, setError] = useState({ products: null, orders: null, customers: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Sellertoken");
        // Fetch Products
        const productsResponse = await axios.get("/product");
        setProducts(productsResponse.data.data);
        setLoading(prev => ({ ...prev, products: false }));
  
        // Fetch Orders
        const ordersResponse = await axios.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(ordersResponse.data.data);
        setLoading(prev => ({ ...prev, orders: false }));
  
        // Fetch Customers
        const customersResponse = await axios.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomers(customersResponse.data.data);
        setLoading(prev => ({ ...prev, customers: false }));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError({
          products: "Failed to load products.",
          orders: "Failed to load orders.",
          customers: "Failed to load customers.",
        });
        setLoading({ products: false, orders: false, customers: false });
      }
    };
    fetchData();
  }, []);
  

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(`/products/${deleteProductId}`, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((p) => p.id !== deleteProductId));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("Sellertoken");
    localStorage.removeItem("user")
    // Bisa juga hapus data user lain jika ada
    // Redirect ke halaman login (sesuaikan dengan routing kamu)
    window.location.href = "/seller/login";
  };
  

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", section: "dashboard" },
    { icon: <FaBox />, label: "Products", section: "products" },
    { icon: <FaList />, label: "Orders", section: "orders" },
    { icon: <FaCog />, label: "Settings", section: "settings" },
    { icon: <FaSignOutAlt />, label: "Logout", section: "logout" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative">
      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-250%' }}
        animate={{ x: isSidebarOpen ? 0 : '-250%' }}
        transition={{ type: 'tween', duration: 1.5 }}
        className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-800 to-purple-900 text-white shadow-xl z-50"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <FaStore className="text-indigo-700 text-xl" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Seller Hub</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-white hover:text-gray-200 focus:outline-none"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-8">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSection(item.section);
                setIsSidebarOpen(true);
                if (item.section === "logout") handleLogout();
              }}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left text-white hover:bg-indigo-700 transition-all duration-200 rounded-r-full ${
                activeSection === item.section ? "bg-indigo-700" : ""
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-base font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-300 text-sm">
          v1.0.0
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-0 transition-all duration-300 md:ml-64">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 shadow-lg"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-white hover:text-gray-200 focus:outline-none"
              >
                <FaList className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FaStore className="text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Restoran Padang Sederhana</h1>
                  <p className="text-xs opacity-80">Manage your culinary business</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
                <p className="text-xs opacity-80">Products</p>
                <p className="text-xl font-semibold">{products.length}</p>
              </div>
              <div className="text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
                <p className="text-xs opacity-80">Total Orders</p>
                <p className="text-xl font-semibold">{orders.length}</p>
              </div>
              <div className="hidden md:block text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
                <p className="text-xs opacity-80">Avg. Rating</p>
                <p className="text-xl font-semibold flex items-center justify-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  {products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Section */}
        <div className="container mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100 flex flex-col md:flex-row gap-5 items-center"
          >
            <div className="w-full relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Search by name..."
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-48 appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white pr-8 transition-all"
                >
                  {activeSection === "products" && (
                    <>
                      <option value="name">Name (A-Z)</option>
                      <option value="price">Price (Low to High)</option>
                      <option value="stock">Stock (Low to High)</option>
                      <option value="rating">Rating (High to Low)</option>
                      <option value="orders">Orders (High to Low)</option>
                    </>
                  )}
                  {activeSection === "orders" && (
                    <>
                      <option value="customer">Customer (A-Z)</option>
                      <option value="total">Total (Low to High)</option>
                      <option value="quantity">Quantity (Low to High)</option>
                      <option value="date">Date (Old to New)</option>
                    </>
                  )}
                  {activeSection === "dashboard" && (
                    <option value="name">Name (A-Z)</option>
                  )}
                  {activeSection === "settings" && (
                    <option value="name">Name (A-Z)</option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {activeSection === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaChartLine className="mr-2 text-indigo-600" /> Dashboard Overview
                </h2>
                <div className="text-sm text-gray-500">Last updated: June 10, 2025</div>
              </div>
              {loading.products || loading.orders ? (
                <div className="text-center py-12">Loading dashboard...</div>
              ) : error.products || error.orders ? (
                <div className="text-center py-12 text-red-600">Failed to load dashboard data.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2">Product Summary</h3>
                    <p className="text-gray-600">Total Products: {products.length}</p>
                    <p className="text-gray-600">In Stock: {products.reduce((sum, p) => sum + p.stock, 0)}</p>
                    <p className="text-gray-600">Avg. Rating: {products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) : '0.0'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">Order Summary</h3>
                    <p className="text-gray-600">Total Orders: {orders.length}</p>
                    <p className="text-gray-600">Pending: {orders.filter(o => o.status === "PENDING").length}</p>
                    <p className="text-gray-600">Total Revenue: Rp {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === "products" && (
            <ProductsSection
              products={products}
              setProducts={setProducts}
              setEditProduct={setEditProduct}
              setDeleteProductId={setDeleteProductId}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              searchQuery={searchQuery}
              sortBy={sortBy}
              loading={loading.products}
              error={error.products}
            />
          )}

          {activeSection === "orders" && (
            <OrdersSection
              orders={orders}
              searchQuery={searchQuery}
              sortBy={sortBy}
              loading={loading.orders}
              error={error.orders}
            />
          )}

          {activeSection === "settings" && <SettingsSection />}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{products.find(p => p.id === deleteProductId)?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Edit Product</h3>
                <button
                  onClick={() => setEditProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <form
  onSubmit={async (e) => {
    e.preventDefault();
    if (
      !editProduct.name ||
      !editProduct.price ||
      !editProduct.stock ||
      !editProduct.image ||
      !editProduct.categoryId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productName", editProduct.name);
      formData.append("price", parseFloat(editProduct.price));
      formData.append("stock", parseInt(editProduct.stock));
      formData.append("image", editProduct.image); // File object expected
      formData.append("categoryId", parseInt(editProduct.categoryId));
      formData.append("description", editProduct.description || "No description");
      formData.append("sellerId", parseInt("1")); // Replace with actual seller ID from auth

      const response = await axios.put(
        `/product/${editProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("Sellertoken")}`,
          },
        }
      );

      const updatedProduct = response.data;
      setProducts(
        products.map((p) => (p.id === editProduct.id ? updatedProduct : p))
      );
      setEditProduct(null);
    } catch (err) {
      console.error("Error updating product:", err);
      if (err.response) {
        alert(`Error: ${err.response.data.message || 'Failed to update product'}`);
      } else {
        alert("Failed to update product. Please try again.");
      }
    }
  }}
  className="space-y-4"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
      <input
        type="text"
        value={editProduct.name}
        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
        <input
          type="number"
          value={editProduct.price}
          onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
      <input
        type="number"
        value={editProduct.stock}
        onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setEditProduct({ ...editProduct, image: e.target.files[0] })}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        value={editProduct.description}
        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
        rows={3}
      />
    </div>
  </div>

  <div className="flex justify-end space-x-3">
    <button
      type="button"
      onClick={() => setEditProduct(null)}
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700"
    >
      Update Product
    </button>
  </div>
</form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboard;