import React, { useState, useEffect, useRef } from 'react';
import { FaPaperclip, FaCamera, FaCheck, FaCheckDouble, FaTimes, FaStore, FaEllipsisV } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ChatComponents = () => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const sellers = [
    { id: 1, name: 'Budi Store', profilePic: 'https://randomuser.me/api/portraits/men/32.jpg', lastMessage: 'Thank you for your purchase!', time: '10:30 AM' },
    { id: 2, name: 'Sari Boutique', profilePic: 'https://randomuser.me/api/portraits/women/44.jpg', lastMessage: 'Your order has been shipped', time: 'Yesterday' },
    { id: 3, name: 'Tech Gadgets', profilePic: 'https://randomuser.me/api/portraits/men/67.jpg', lastMessage: 'New products available now', time: 'Monday' },
  ];

  const handleSellerSelect = (seller) => {
    setSelectedSeller(seller);
    // Simulate loading previous messages
    setTimeout(() => {
      setMessages([
        { sender: 'Seller', text: `Hello! Welcome to ${seller.name}. How can I help you?`, status: 'read', time: '10:00 AM' },
        { sender: 'User', text: 'Hi! I have a question about my order', status: 'read', time: '10:02 AM' },
      ]);
    }, 300);
  };

  const handleSendMessage = () => {
    if (message.trim() || file || cameraImage) {
      const newMessage = {
        sender: 'User',
        text: message,
        file,
        cameraImage,
        seller: selectedSeller,
        status: 'sent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...messages, newMessage]);
      setMessage("");
      setFile(null);
      setCameraImage(null);

      // Simulate message being read
      setTimeout(() => {
        setMessages(prev => prev.map((msg, i) => 
          i === messages.length ? { ...msg, status: 'read' } : msg
        ));
      }, 2000);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCameraChange = (imageSrc) => {
    setCameraImage(imageSrc);
  };

  const goToDetailStore = (sellerId) => {
    navigate(`/detail-store/${sellerId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when seller is selected
  useEffect(() => {
    if (selectedSeller && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedSeller]);

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search sellers..."
              className="w-full p-2 pl-8 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredSellers.map((seller) => (
            <div
              key={seller.id}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedSeller?.id === seller.id ? 'bg-green-50' : ''
              }`}
              onClick={() => handleSellerSelect(seller)}
            >
              <img
                src={seller.profilePic}
                alt={seller.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{seller.name}</h3>
                  <span className="text-xs text-gray-500">{seller.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{seller.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSeller ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <img
                  src={selectedSeller.profilePic}
                  alt={selectedSeller.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedSeller.name}</h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => goToDetailStore(selectedSeller.id)}
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  title="Visit store"
                >
                  <FaStore size={18} />
                </button>
                <button className="text-gray-600 hover:text-green-600 transition-colors">
                  <FaEllipsisV size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-3 max-w-3xl mx-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'User'
                          ? 'bg-green-500 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                      {msg.cameraImage && (
                        <img
                          src={msg.cameraImage}
                          alt="Camera"
                          className="mt-2 max-w-xs rounded-md"
                        />
                      )}
                      {msg.file && (
                        <div className="mt-2 p-2 bg-white bg-opacity-20 rounded">
                          <a
                            href={URL.createObjectURL(msg.file)}
                            download
                            className="flex items-center text-sm"
                          >
                            <FaPaperclip className="mr-2" />
                            {msg.file.name}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-70">{msg.time}</span>
                        {msg.sender === 'User' && (
                          <span className="ml-1">
                            {msg.status === 'sent' && <FaCheck className="text-xs" />}
                            {msg.status === 'read' && <FaCheckDouble className="text-xs text-blue-300" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer text-gray-500 hover:text-green-600 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <FaPaperclip size={20} />
                </label>
                <label className="cursor-pointer text-gray-500 hover:text-green-600 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    capture="camera"
                    onChange={(e) => handleCameraChange(URL.createObjectURL(e.target.files[0]))}
                    className="hidden"
                  />
                  <FaCamera size={20} />
                </label>
                <div className="flex-1 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    className="w-full p-3 pr-12 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() && !file && !cameraImage}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                      message.trim() || file || cameraImage
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'text-gray-400'
                    } transition-colors`}
                  >
                    <FiSend size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <div className="max-w-md">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No conversation selected</h3>
              <p className="mt-2 text-sm text-gray-500">
                Select a seller from the sidebar to start chatting or search for a seller using the search bar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponents;