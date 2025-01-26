import React, { useState } from "react";
import { FaShoppingCart, FaChartLine, FaComments, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
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
        label: "Sales",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
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
      },
    ],
  };

  // State for toggling order list and feedback visibility
  const [showOrders, setShowOrders] = useState(false);
  const [showFeedbacks, setShowFeedbacks] = useState(false);

  // State for orders and their messages
  const [orders, setOrders] = useState([
    { id: 1, product: "Product A", status: "Pending", total: "$50", newMessage: "" },
    { id: 2, product: "Product B", status: "Pending", total: "$120", newMessage: "" },
    { id: 3, product: "Product C", status: "Pending", total: "$30", newMessage: "" },
  ]);

  // State for feedbacks
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, product: "Product A", message: "Great product, will buy again!", read: false, rating: 5 },
    { id: 2, product: "Product B", message: "Good quality, fast delivery!", read: false, rating: 4 },
    { id: 3, product: "Product C", message: "Not as expected, disappointed.", read: false, rating: 2 },
  ]);

  // Toggle visibility for orders and feedbacks
  const toggleOrders = () => setShowOrders(!showOrders);
  const toggleFeedbacks = () => setShowFeedbacks(!showFeedbacks);

  // Handle accept action for a single order
  const handleAcceptOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Accepted" } : order
      )
    );
  };

  // Handle decline action for a single order
  const handleDeclineOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Declined" } : order
      )
    );
  };

  // Handle sending a message for a specific order
  const handleSendMessage = (orderId) => {
    const message = orders.find(order => order.id === orderId).newMessage.trim();
    if (message === "") return;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, newMessage: "" } : order
      )
    );
    alert(`Message sent for order ${orderId}: ${message}`);
  };

  // Handle change in feedback reply input
  const handleFeedbackReplyChange = (feedbackId, reply) => {
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback.id === feedbackId ? { ...feedback, reply } : feedback
      )
    );
  };

  // Handle sending a reply to a feedback message
  const handleSendFeedbackReply = (feedbackId) => {
    const reply = feedbacks.find(feedback => feedback.id === feedbackId).reply.trim();
    if (reply === "") return;
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback.id === feedbackId ? { ...feedback, reply: "", read: true } : feedback
      )
    );
    alert(`Reply sent for feedback ${feedbackId}: ${reply}`);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overview Cards */}
      <div className="bg-blue-100 p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Total Sales</h3>
            <p className="text-3xl font-bold">$12,345</p>
          </div>
          <FaChartLine size={40} className="text-blue-500" />
        </div>
      </div>

      <div className="bg-green-100 p-4 rounded-lg shadow-md cursor-pointer" onClick={toggleOrders}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Orders</h3>
            <p className="text-3xl font-bold">150</p>
          </div>
          <FaShoppingCart size={40} className="text-green-500" />
        </div>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg shadow-md cursor-pointer" onClick={toggleFeedbacks}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Feedback</h3>
            <p className="text-3xl font-bold">45</p>
          </div>
          <FaComments size={40} className="text-yellow-500" />
        </div>
      </div>

      {/* Sales Chart */}
      <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <Bar data={salesData} />
      </div>

      {/* Order Status Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Order Status</h3>
        <Pie data={orderStatusData} />
      </div>

      {/* Order List Section */}
      {showOrders && (
        <div className="col-span-3 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Order List</h3>
          <table className="min-w-full table-auto text-sm text-gray-600">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Action</th>
                <th className="px-6 py-3 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">{order.product}</td>
                  <td className="px-6 py-4">{order.status}</td>
                  <td className="px-6 py-4">{order.total}</td>
                  <td className="px-6 py-4">
                    {order.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineOrder(order.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={order.newMessage}
                        onChange={(e) => handleMessageChange(order.id, e.target.value)}
                        placeholder="Send a message"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        onClick={() => handleSendMessage(order.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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
      )}

      {/* Feedback List Section */}
      {showFeedbacks && (
        <div className="col-span-3 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Feedback List</h3>
          <table className="min-w-full table-auto text-sm text-gray-600">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Feedback</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Rating</th>
                <th className="px-6 py-3 text-left">Reply</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{feedback.id}</td>
                  <td className="px-6 py-4">{feedback.product}</td>
                  <td className="px-6 py-4">{feedback.message}</td>
                  <td className="px-6 py-4">{feedback.read ? "Read" : "Unread"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">{renderStars(feedback.rating)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={feedback.reply}
                      onChange={(e) => handleFeedbackReplyChange(feedback.id, e.target.value)}
                      placeholder="Reply to feedback"
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSendFeedbackReply(feedback.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Send Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
