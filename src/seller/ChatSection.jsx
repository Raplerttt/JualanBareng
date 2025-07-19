import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperclip, FaCamera, FaCheck, FaCheckDouble, FaStore, FaEllipsisV } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import axios from "../../utils/axios";
import { AuthContext } from "../auth/authContext";
import toast from "react-hot-toast";
import { debounce } from "lodash";

const ChatSection = () => {
  const { user, token, isAuthenticated, refreshAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Validate seller authentication
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "SELLER") {
      toast.error("Silakan login sebagai penjual");
      navigate("/seller/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch customer chats
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "SELLER") return;

    let isMounted = true;

    const fetchChats = async () => {
      setIsLoadingCustomers(true);
      try {
        const response = await axios.get("/chats", {
          headers: { Authorization: `Bearer ${token}` },
          params: { sellerId: user.id, timestamp: new Date().getTime() },
        });

        if (!isMounted) return;

        const chatData = response.data.data || response.data || [];
        if (!Array.isArray(chatData) || chatData.length === 0) {
          toast.info("Tidak ada riwayat obrolan ditemukan");
          setCustomers([]);
          setIsLoadingCustomers(false);
          return;
        }

        chatData.sort((a, b) => a.id - b.id);

        const customerMap = new Map();
        chatData.forEach((chat) => {
          if (!chat.user || !chat.messages?.length || chat.sellerId !== user.id) {
            return;
          }

          customerMap.set(chat.id, {
            id: chat.id,
            userId: chat.userId,
            name: chat.user?.fullName || `Customer ${chat.userId}`,
            profilePic: chat.user?.photo || "https://randomuser.me/api/portraits/lego/1.jpg",
            lastMessage: chat.messages.at(-1)?.content || "",
            time: chat.createdAt
              ? new Date(chat.createdAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            chatId: chat.id,
            orderId: chat.orderId || null,
          });
        });

        const uniqueCustomers = Array.from(customerMap.values()).sort(
          (a, b) => b.chatId - a.chatId
        );
        setCustomers(uniqueCustomers);

        if (uniqueCustomers.length > 0 && !selectedCustomer) {
          debouncedHandleCustomerSelect(uniqueCustomers[0]);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            fetchChats(); // Retry after token refresh
            return;
          }
        }
        toast.error(err.response?.data?.message || "Gagal memuat daftar chat");
      } finally {
        if (isMounted) setIsLoadingCustomers(false);
      }
    };

    fetchChats();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, token, selectedCustomer, refreshAccessToken]);

  // Fetch messages for selected customer
  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(customer);
    setMessages([]);
    setIsLoadingMessages(true);

    try {
      const response = await axios.get(`/chats?userId=${customer.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { sellerId: user.id, timestamp: new Date().getTime() },
      });

      const chatData = response.data.data || response.data || [];
      const filteredChatData = chatData.filter(
        (chat) => chat.userId === customer.userId && chat.sellerId === user.id
      );

      if (filteredChatData.length === 0) {
        setMessages([]);
        setIsLoadingMessages(false);
        return;
      }

      filteredChatData.sort((a, b) => a.id - b.id);

      const chatMessages = filteredChatData.flatMap((chat) =>
        (chat.messages || []).map((msg) => ({
          sender: msg.senderId === customer.userId ? "User" : "Seller",
          text: msg.content,
          status: "read",
          time: new Date(msg.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );

      setMessages(chatMessages);
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          handleCustomerSelect(customer); // Retry after token refresh
          return;
        }
      }
      toast.error(err.response?.data?.message || "Gagal memuat pesan");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const debouncedHandleCustomerSelect = debounce(handleCustomerSelect, 300);

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() && !file && !cameraImage) return;

    const newMessage = {
      sender: "Seller",
      text: message,
      file,
      cameraImage,
      status: "sent",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      const response = await axios.post(
        "/messages",
        {
          chatId: selectedCustomer.chatId,
          senderId: user.id,
          senderType: "SELLER",
          content: message.trim() || "Lampiran",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newChat = response.data.data;

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setFile(null);
      setCameraImage(null);

      setCustomers((prev) => {
        const updated = prev.filter((c) => c.id !== selectedCustomer.id);
        return [
          ...updated,
          {
            ...selectedCustomer,
            lastMessage: message.trim() || "Lampiran",
            time: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            chatId: newChat?.chatId || selectedCustomer.chatId,
          },
        ].sort((a, b) => b.chatId - a.chatId);
      });

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1 ? { ...msg, status: "read" } : msg
          )
        );
      }, 2000);
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          handleSendMessage(); // Retry after token refresh
          return;
        }
      }
      toast.error(err.response?.data?.message || "Gagal mengirim pesan");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCameraChange = (imageSrc) => {
    setCameraImage(imageSrc);
  };

  const goToDetailOrder = (orderId) => {
    if (orderId) {
      navigate(`/order/${orderId}`);
    } else {
      toast.error("Tidak ada pesanan terkait");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedCustomer && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedCustomer]);

  const filteredCustomers = React.useMemo(() => {
    return customers.filter((customer) =>
      (customer.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh-100px)] bg-gray-50"
    >
      {/* Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-80 bg-white rounded-2xl shadow-lg border-r border-gray-200 flex flex-col"
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Pesan Pelanggan</h2>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Cari pelanggan..."
              className="w-full p-2 pl-8 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
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
          {isLoadingCustomers ? (
            <div className="p-4 text-center text-gray-500">Memuat daftar pelanggan...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Tidak ada chat ditemukan</div>
          ) : (
            filteredCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCustomer?.id === customer.id ? "bg-indigo-50" : ""
                }`}
                onClick={() => debouncedHandleCustomerSelect(customer)}
              >
                <img
                  src={customer.profilePic}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{customer.name}</h3>
                    <span className="text-xs text-gray-500">{customer.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{customer.lastMessage}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Chat Area */}
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
                <img
                    src={`http://localhost:3000/${selectedCustomer.profilePic}`}
                  alt={selectedCustomer.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{selectedCustomer.name}</h3>
                  <p className="text-xs text-gray-500">Online</p>
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
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Memuat pesan...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Belum ada pesan</p>
                </div>
              ) : (
                <div className="space-y-3 max-w-3xl mx-auto">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.sender === "Seller" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                          msg.sender === "Seller"
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none shadow-sm"
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
                          {msg.sender === "Seller" && (
                            <span className="ml-1">
                              {msg.status === "sent" && <FaCheck className="text-xs" />}
                              {msg.status === "read" && (
                                <FaCheckDouble className="text-xs text-blue-300" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <FaPaperclip size={20} />
                </motion.label>
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    capture="camera"
                    onChange={(e) => handleCameraChange(URL.createObjectURL(e.target.files[0]))}
                    className="hidden"
                  />
                  <FaCamera size={20} />
                </motion.label>
                <div className="flex-1 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    className="w-full p-3 pr-12 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik pesan Anda..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    disabled={!message.trim() && !file && !cameraImage}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                      message.trim() || file || cameraImage
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "text-gray-400"
                    } transition-colors`}
                  >
                    <FiSend size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
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
    </motion.div>
  );
};

export default ChatSection;