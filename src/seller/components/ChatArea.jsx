import React, { useEffect, useRef } from 'react';
import { FaStore, FaEllipsisV, FaList } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import MessageInput from './MessageInput';

const ChatArea = ({ selectedCustomer, messages, setMessages, user, isSidebarOpen, setIsSidebarOpen }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const goToDetailOrder = (orderId) => {
    if (orderId) {
      window.location.href = `/order/${orderId}`;
    } else {
      alert('Tidak ada pesanan terkait');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col"
    >
      {selectedCustomer ? (
        <>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl shadow-sm">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-gray-600 hover:text-gray-800 mr-3"
              >
                <FaList size={18} />
              </button>
              <div className="relative">
                <img
                  src={selectedCustomer.profilePic}
                  alt={selectedCustomer.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                {selectedCustomer.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{selectedCustomer.name}</h3>
                <p className="text-xs text-gray-500">{selectedCustomer.isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToDetailOrder(selectedCustomer.orderId)}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
                title="Lihat pesanan"
              >
                <FaStore size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <FaEllipsisV size={18} />
              </motion.button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Belum ada pesan</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-3xl mx-auto">
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.sender === 'Seller' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                          msg.sender === 'Seller'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                        {msg.cameraImage && (
                          <img
                            src={msg.cameraImage}
                            alt="Kamera"
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
                          {msg.sender === 'Seller' && (
                            <span className="ml-1">
                              {msg.status === 'sent' && <FaCheck className="text-xs" />}
                              {msg.status === 'read' && (
                                <FaCheckDouble className="text-xs text-blue-300" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <MessageInput
            messages={messages}
            setMessages={setMessages}
            selectedCustomer={selectedCustomer}
            user={user}
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center"
        >
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
            <h3 className="mt-4 text-lg font-medium text-gray-800">
              Tidak ada percakapan dipilih
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Pilih pelanggan dari sidebar untuk mulai mengobrol atau cari pelanggan menggunakan kolom pencarian.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatArea;