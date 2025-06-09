import React, { useState } from "react";
import { FaShoppingCart, FaChartLine, FaComments, FaStar, FaStarHalfAlt, FaRegStar, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import axios from "../../utils/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SellerDashboard = () => {
  // Example data for sales and order status
  const salesData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales ($)",
        backgroundColor: "rgba(74, 181, 235, 0.2)",
        borderColor: "rgba(74, 181, 235, 1)",
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(74, 181, 235, 0.4)",
        hoverBorderColor: "rgba(74, 181, 235, 1)",
        data: [65, 59, 80, 81, 56, 55],
      },
    ],
  };

  const orderStatusData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  // State for toggling sections
  const [showOrders, setShowOrders] = useState(false);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  // State for orders
  const [orders, setOrders] = useState([
    { id: 1, product: "Premium Watch", status: "Pending", total: "$120", newMessage: "" },
    { id: 2, product: "Wireless Headphones", status: "Pending", total: "$89", newMessage: "" },
    { id: 3, product: "Leather Wallet", status: "Pending", total: "$45", newMessage: "" },
  ]);

  // State for feedbacks
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, product: "Premium Watch", message: "Excellent quality and fast shipping!", read: false, rating: 5, reply: "" },
    { id: 2, product: "Wireless Headphones", message: "Good sound quality but battery life could be better", read: false, rating: 4, reply: "" },
    { id: 3, product: "Leather Wallet", message: "Not as durable as expected", read: false, rating: 2, reply: "" },
  ]);

  // State for products
  const [products, setProducts] = useState([
    { id: 1, name: "Premium Watch", price: "$120", description: "Luxury watch with leather strap", image: "watch.jpg" },
    { id: 2, name: "Wireless Headphones", price: "$89", description: "Noise-cancelling Bluetooth headphones", image: "headphones.jpg" },
  ]);
  
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    price: "", 
    categoryName: "", 
    description: "", 
    image: null 
  });

  // Toggle visibility functions
  const toggleOrders = () => setShowOrders(!showOrders);
  const toggleFeedbacks = () => setShowFeedbacks(!showFeedbacks);
  const toggleProducts = () => setShowProducts(!showProducts);

  // Handle order actions
  const handleAcceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: "Accepted" } : order
    ));
  };

  const handleDeclineOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: "Declined" } : order
    ));
  };

  const handleSendMessage = (orderId) => {
    const message = orders.find(order => order.id === orderId).newMessage.trim();
    if (!message) return;
    
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, newMessage: "" } : order
    ));
    alert(`Message sent for order ${orderId}: ${message}`);
  };

  // Handle feedback actions
  const handleFeedbackReplyChange = (feedbackId, reply) => {
    setFeedbacks(feedbacks.map(feedback => 
      feedback.id === feedbackId ? { ...feedback, reply } : feedback
    ));
  };

  const handleSendFeedbackReply = (feedbackId) => {
    const reply = feedbacks.find(feedback => feedback.id === feedbackId).reply.trim();
    if (!reply) return;
    
    setFeedbacks(feedbacks.map(feedback => 
      feedback.id === feedbackId ? { ...feedback, reply: "", read: true } : feedback
    ));
    alert(`Reply sent for feedback ${feedbackId}: ${reply}`);
  };

  // Render star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => {
      if (i < Math.floor(rating)) {
        return <FaStar key={i} className="text-yellow-400 inline" />;
      } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
        return <FaStarHalfAlt key={i} className="text-yellow-400 inline" />;
      }
      return <FaRegStar key={i} className="text-yellow-400 inline" />;
    });
  };

  // Handle product addition
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.categoryName || !newProduct.image) {
      alert("Please fill in all required fields including image.");
      return;
    }

    try {
      const token = localStorage.getItem('Sellertoken');
      if (!token) {
        alert('You must be logged in as a seller to add a product');
        return;
      }

      const formData = new FormData();
      formData.append('productName', newProduct.name);
      formData.append('categoryName', newProduct.categoryName);
      formData.append('price', parseFloat(newProduct.price));
      formData.append('description', newProduct.description || '');
      formData.append('image', newProduct.image);

      const response = await axios.post('/product', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', categoryName: '', description: '', image: null });
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.message || 'An error occurred while adding the product.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Seller Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sales Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Sales</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">$12,345</p>
              <p className="text-sm text-blue-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaChartLine size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div 
          className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-100 cursor-pointer hover:shadow-md transition-shadow"
          onClick={toggleOrders}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-600">Orders</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">150</p>
              <p className="text-sm text-green-600 mt-1">{orders.filter(o => o.status === 'Pending').length} pending</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaShoppingCart size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Feedback Card */}
        <div 
          className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-sm border border-yellow-100 cursor-pointer hover:shadow-md transition-shadow"
          onClick={toggleFeedbacks}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-600">Feedback</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">45</p>
              <p className="text-sm text-yellow-600 mt-1">{feedbacks.filter(f => !f.read).length} unread</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaComments size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <Bar 
            data={salesData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }} 
          />
        </div>

        {/* Order Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie 
              data={orderStatusData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>

      {/* Order List Section */}
      {showOrders && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Order Management</h3>
            <button 
              onClick={toggleOrders}
              className="text-sm flex items-center gap-1 text-gray-500 hover:text-gray-700"
            >
              {showOrders ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              {showOrders ? "Hide Orders" : "Show Orders"}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status === "Pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineOrder(order.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={order.newMessage}
                          onChange={(e) => setOrders(orders.map(o => 
                            o.id === order.id ? { ...o, newMessage: e.target.value } : o
                          ))}
                          placeholder="Type message..."
                          className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full"
                        />
                        <button
                          onClick={() => handleSendMessage(order.id)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback List Section */}
      {showFeedbacks && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Customer Feedback</h3>
            <button 
              onClick={toggleFeedbacks}
              className="text-sm flex items-center gap-1 text-gray-500 hover:text-gray-700"
            >
              {showFeedbacks ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              {showFeedbacks ? "Hide Feedback" : "Show Feedback"}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reply</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{feedback.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.product}</td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${!feedback.read ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                        {feedback.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                        <span className="ml-1 text-xs text-gray-500">({feedback.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={feedback.reply}
                          onChange={(e) => handleFeedbackReplyChange(feedback.id, e.target.value)}
                          placeholder="Type your reply..."
                          className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full"
                        />
                        <button
                          onClick={() => handleSendFeedbackReply(feedback.id)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Product Management</h3>
          <button 
            onClick={toggleProducts}
            className="text-sm flex items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            {showProducts ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            {showProducts ? "Hide Products" : "Show Products"}
          </button>
        </div>
        
        {showProducts && (
          <>
            <form onSubmit={handleAddProduct} className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Add New Product</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                  <input
                    type="text"
                    placeholder="e.g., Wireless Earbuds"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                  <input
                    type="text"
                    placeholder="e.g., 59.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <input
                    type="text"
                    placeholder="e.g., Electronics"
                    value={newProduct.categoryName}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryName: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image*</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                    className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Product description..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 h-24"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <FaPlus size={14} />
                Add Product
              </button>
            </form>

            <h4 className="text-lg font-medium text-gray-800 mb-4">Your Products</h4>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No products added yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;