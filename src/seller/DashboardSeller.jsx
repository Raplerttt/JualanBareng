import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaChartLine,
  FaStore,
  FaHome,
  FaList,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaStar,
  FaSearch,
  FaTimes,
  FaTicketAlt,
  FaComments,
  FaPaperclip,
  FaCamera,
  FaCheck,
  FaCheckDouble,
  FaEllipsisV,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import axios from '../../utils/axios';
import ProductsSection from './ProductSection';
import OrdersSection from './OrderSection';
import ChatSection from './ChatSection';
import SettingsSection from './SettingSection';
import { jwtDecode } from "jwt-decode";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler 
);

const SellerDashboard = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sellerData, setSellerData] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState({
    products: true,
    orders: true,
    customers: true,
    seller: true,
    categories: true,
  });
  const [error, setError] = useState({
    products: null,
    orders: null,
    customers: null,
    seller: null,
    categories: null,
  });

  const token = localStorage.getItem('Admintoken');

  // Helper function to get seller ID
  const getSellerId = () => {
    try {
      const token = localStorage.getItem("Admintoken");
      if (!token) return null;
  
      const decoded = jwtDecode(token);
      return decoded?.id || null;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError({
          seller: 'Please login to access dashboard',
          products: 'Please login to view products',
          orders: 'Please login to view orders',
          customers: 'Please login to view customers',
          categories: 'Please login to view categories',
        });
        setLoading({
          seller: false,
          products: false,
          orders: false,
          customers: false,
          categories: false,
        });
        return;
      }

      try {
        const [
          sellerResponse,
          categoriesResponse,
          productsResponse,
          ordersResponse,
          customersResponse
        ] = await Promise.all([
          axios.get('/seller/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/categories', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('product/my-product', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/orders', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/users', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setSellerData({
          id: sellerResponse.data.data.id,
          storeName: sellerResponse.data.data.storeName || 'My Store',
          email: sellerResponse.data.data.email || '',
          phoneNumber: sellerResponse.data.data.phoneNumber || '',
          address: sellerResponse.data.data.address || '',
          city: sellerResponse.data.data.city || '',
          photo: sellerResponse.data.data.photo || null,
        });

        setCategories(categoriesResponse.data.data || []);
        setProducts(productsResponse.data.data || []);
        setOrders(ordersResponse.data.data || []);
        setCustomers(customersResponse.data.data || []);

        setLoading({
          seller: false,
          categories: false,
          products: false,
          orders: false,
          customers: false,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError({
          seller: err.message.includes('seller/me') ? err.response?.data?.message || 'Failed to load seller data' : null,
          products: err.message.includes('product/my-product') ? err.response?.data?.message || 'Failed to load products' : null,
          orders: err.message.includes('orders') ? err.response?.data?.message || 'Failed to load orders' : null,
          customers: err.message.includes('users') ? err.response?.data?.message || 'Failed to load customers' : null,
          categories: err.message.includes('categories') ? err.response?.data?.message || 'Failed to load categories' : null,
        });
        setLoading({
          seller: false,
          products: false,
          orders: false,
          customers: false,
          categories: false,
        });
      }
    };

    fetchData();
  }, [token]);

  // Calculate revenue data for chart
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateString = date.toISOString().split('T')[0];
    return orders
      .filter((o) => o.createdAt?.startsWith(dateString))
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  });

  // Calculate average rating
  const calculateAverageRating = (products) => {
    if (!products.length) return 0;
    const total = products.reduce((sum, p) => sum + (p.rating || 0), 0);
    return (total / products.length).toFixed(1);
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!token) {
      alert('Please login again');
      return;
    }
    try {
      await axios.delete(`/product/${deleteProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== deleteProductId));
      setIsDeleteModalOpen(false);
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(`Failed to delete product: ${err.response?.data?.message || 'Please try again'}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('AdminRefreshToken');
    window.location.href = '/seller/login';
  };

  // Navigation items
  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', section: 'dashboard' },
    { icon: <FaBox />, label: 'Produk', section: 'products' },
    { icon: <FaList />, label: 'Order', section: 'orders' },
    { icon: <FaComments />, label: 'Chat', section: 'chat' },
    { icon: <FaCog />, label: 'Setting', section: 'settings' },
    { icon: <FaSignOutAlt />, label: 'Logout', section: 'logout', action: handleLogout },
  ];

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Revenue (Rp)' }
      },
      x: {
        title: { display: true, text: 'Date' }
      }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Rp ${context.parsed.y.toLocaleString('id-ID')}`;
          }
        }
      }
    }
  };

  const chartData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [{
      label: 'Revenue (Rp)',
      data: revenueData,
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative">
      {/* Mobile sidebar overlay */}
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
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b bg-[#80CBC4] text-white shadow-xl z-50"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <FaStore className="text-indigo-700 text-xl" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-black">Seller Hub</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-black hover:text-gray-200 focus:outline-none"
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
                if (item.action) item.action();
              }}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left text-black hover:bg-[#3fcec0]  transition-all duration-200 rounded-r-full ${
                activeSection === item.section ? 'bg-[#3fcec0]' : ''
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

      {/* Main content */}
      <div className="flex-1 ml-0 transition-all duration-300 md:ml-64">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r bg-[#80CBC4] text-black p-4 shadow-lg"
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
                  <h1 className="text-xl font-bold">
                    {sellerData?.storeName || 'My Store'}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
                <p className="text-xs opacity-80">Produk</p>
                <p className="text-xl font-semibold">{products.length}</p>
              </div>
              <div className="text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
                <p className="text-xs opacity-80">Total Order</p>
                <p className="text-xl font-semibold">{orders.length}</p>
              </div>
              <div className="hidden md:block text-center bg-white/10 p-3 rounded-lg min-w-[100px]">
                <p className="text-xs opacity-80">Avg. Rating</p>
                <p className="text-xl font-semibold flex items-center justify-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  {calculateAverageRating(products)}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main section content */}
        <div className="container mx-auto p-4">
          {/* Search and sort bar */}
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
                    onClick={() => setSearchQuery('')}
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
                  {activeSection === 'products' && (
                    <>
                      <option value="name">Name (A-Z)</option>
                      <option value="price">Price (Low to High)</option>
                      <option value="stock">Stock (Low to High)</option>
                      <option value="rating">Rating (High to Low)</option>
                      <option value="orders">Orders (High to Low)</option>
                    </>
                  )}
                  {activeSection === 'orders' && (
                    <>
                      <option value="customer">Customer (A-Z)</option>
                      <option value="total">Total (Low to High)</option>
                      <option value="date">Date (Old to New)</option>
                      <option value="status">Status</option>
                    </>
                  )}
                  {['dashboard', 'settings', 'chat'].includes(activeSection) && (
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

          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaChartLine className="mr-2 text-indigo-600" /> Dashboard
                </h2>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
              {loading.products || loading.orders || loading.seller ? (
                <div className="text-center py-12">Loading dashboard...</div>
              ) : error.products || error.orders || error.seller ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error.seller}</p>
                  <p className="text-red-600">{error.products}</p>
                  <p className="text-red-600">{error.orders}</p>
                  <button
                    onClick={() => fetchData()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">Ringkasan Produk</h3>
                      <p className="text-gray-600">Total Produk: {products.length}</p>
                      <p className="text-gray-600">
                        Stok: {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
                      </p>
                      <p className="text-gray-600">
                        Avg. Rating: {calculateAverageRating(products)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Ringkasan Order</h3>
                      <p className="text-gray-600">Total Order: {orders.length}</p>
                      <p className="text-gray-600">
                        Pending: {orders.filter((o) => o.status === 'PENDING').length}
                      </p>
                      <p className="text-gray-600">
                        Total Penghasilan: Rp{' '}
                        {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">Produk Teratas</h3>
                      {(() => {
                        const productSales = products
                          .map((product) => ({
                            ...product,
                            totalSold: orders.reduce((sum, order) => {
                              const orderDetail = order.orderDetails?.find(
                                (od) => od.productId === product.id
                              );
                              return sum + (orderDetail?.quantity || 0);
                            }, 0),
                          }))
                          .sort((a, b) => b.totalSold - a.totalSold)
                          .slice(0, 3);
                        return productSales.length > 0 ? (
                          <ul className="text-gray-600 text-sm">
                            {productSales.map((product) => (
                              <li key={product.id} className="mb-1">
                                {product.productName}: {product.totalSold} sold
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600 text-sm">No sales data available</p>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pendapatan (Dalam 7 hari Terakhir)</h3>
                    <div className="h-80">
                      <Chart type="line" data={chartData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Products Section */}
          {activeSection === 'products' && (
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
              categories={categories}
            />
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <OrdersSection
              orders={orders}
              searchQuery={searchQuery}
              sortBy={sortBy}
              loading={loading.orders}
              error={error.orders}
            />
          )}

          {/* Chat Section */}
          {activeSection === 'chat' && (
            <ChatSection
              searchQuery={searchQuery}
              loading={loading.customers}
              error={error.customers}
              customers={customers}
            />
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <SettingsSection sellerData={sellerData} />
          )}
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
                Are you sure you want to delete{' '}
                <span className="font-semibold">
                  {products.find((p) => p.id === deleteProductId)?.productName || 'this product'}
                </span>
                ? This action cannot be undone.
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
                  if (!token) {
                    alert('Please login again');
                    return;
                  }
                  const sellerId = getSellerId();
                  if (!sellerId) {
                    alert('Seller ID not found. Please login again');
                    return;
                  }
                  if (
                    !editProduct.productName?.trim() ||
                    !editProduct.price ||
                    !editProduct.stock ||
                    !editProduct.categoryId
                  ) {
                    alert('Please fill all required fields');
                    return;
                  }
                  if (Number(editProduct.price) <= 0 || Number(editProduct.stock) < 0) {
                    alert('Price must be greater than 0 and stock cannot be negative');
                    return;
                  }

                  try {
                    const formData = new FormData();
                    formData.append('productName', editProduct.productName.trim());
                    formData.append('price', parseFloat(editProduct.price));
                    formData.append('stock', parseInt(editProduct.stock));
                    if (editProduct.image instanceof File) {
                      formData.append('image', editProduct.image);
                    }
                    formData.append('categoryId', parseInt(editProduct.categoryId));
                    formData.append('description', editProduct.description?.trim() || 'No description');
                    formData.append('sellerId', parseInt(sellerId));

                    const response = await axios.put(`/product/${editProduct.id}`, formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                      },
                    });

                    const updatedProduct = response.data.data;
                    setProducts(products.map((p) => (p.id === editProduct.id ? updatedProduct : p)));
                    setEditProduct(null);
                    alert('Product updated successfully!');
                  } catch (err) {
                    console.error('Error updating product:', err);
                    alert(`Failed to update product: ${err.response?.data?.message || 'Please try again'}`);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={editProduct.productName || ''}
                      onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        value={editProduct.price || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={editProduct.stock || ''}
                      onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    {loading.categories ? (
                      <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100">
                        Loading categories...
                      </div>
                    ) : error.categories ? (
                      <div className="text-red-600 text-sm">{error.categories}</div>
                    ) : (
                      <select
                        value={editProduct.categoryId || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })}
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editProduct.description || ''}
                      onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditProduct({ ...editProduct, image: e.target.files[0] })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditProduct(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
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