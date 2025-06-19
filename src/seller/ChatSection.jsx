import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaStore, FaEllipsisV, FaPaperclip, FaCamera, FaCheck, FaCheckDouble } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const ChatSection = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Ambil sellerId dari localStorage dengan penanganan error
  const getSellerId = () => {
    try {
      const sellerDataRaw = localStorage.getItem("SellerUser");
      if (!sellerDataRaw) return null;
      const sellerData = JSON.parse(sellerDataRaw);
      return sellerData?.id || null;
    } catch (err) {
      console.error("Error parsing SellerUser:", err);
      return null;
    }
  };

  // Fetch daftar chat pelanggan
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("Sellertoken");
        if (!token) {
          toast.error("Silakan login untuk melihat chat");
          return;
        }

        const response = await axios.get("/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const chatData = response.data.data || [];
        chatData.sort((a, b) => a.id - b.id);

        const customerMap = new Map();
        chatData.forEach((chat) => {
          if (!chat.user || !chat.messages?.length) return;

          customerMap.set(chat.id, {
            id: chat.id,
            userId: chat.userId,
            name: chat.user?.fullName || `Customer ${chat.userId}`,
            profilePic:
              chat.user?.photo || "https://randomuser.me/api/portraits/lego/1.jpg",
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
      } catch (err) {
        console.error("Error fetching chats:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Gagal memuat chat");
      }
    };

    fetchChats();
  }, []);

  // Fetch pesan untuk pelanggan yang dipilih
  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(customer);

    try {
      const token = localStorage.getItem("Sellertoken");
      if (!token) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      const response = await axios.get(`/chats?chatId=${customer.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const chatData = response.data.data || [];
      chatData.sort((a, b) => a.id - b.id);

      const chatMessages = chatData.flatMap((chat) =>
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
      console.error("Error fetching messages:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Gagal memuat pesan");
    }
  };

  // Kirim pesan baru
  const handleSendMessage = async () => {
    if (!message.trim() && !file && !cameraImage) return;

    const newMessage = {
      sender: "Seller",
      text: message,
      file,
      cameraImage,
      status: "sent",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      const token = localStorage.getItem("Sellertoken");
      const sellerId = getSellerId();

      if (!token || !sellerId) {
        toast.error("Token atau seller ID tidak ditemukan. Harap login ulang.");
        return;
      }

      const response = await axios.post(
        "/messages",
        {
          chatId: selectedCustomer.chatId,
          senderId: sellerId,
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

      // Update daftar pelanggan
      setCustomers((prev) => {
        const updated = prev.filter((c) => c.id !== selectedCustomer.id);
        return [
          ...updated,
          {
            ...selectedCustomer,
            lastMessage: message.trim() || "Lampiran",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            chatId: newChat?.chatId || selectedCustomer.chatId,
          },
        ].sort((a, b) => b.chatId - a.chatId);
      });

      // Simulasi pesan terbaca
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1 ? { ...msg, status: "read" } : msg
          )
        );
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengirim pesan");
      console.error("Gagal mengirim pesan:", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCameraChange = (imageSrc) => {
    setCameraImage(imageSrc);
  };

  const goToDetailOrder = (orderId) => {
    console.log("Navigate to order:", orderId);
    // Implementasi navigasi ke detail pesanan jika diperlukan
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll ke bawah saat pesan berubah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fokus input saat pelanggan dipilih
  useEffect(() => {
    if (selectedCustomer && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedCustomer]);

  const filteredCustomers = customers.filter((customer) =>
    (customer.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Pesan Pelanggan
          </h2>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Cari pelanggan..."
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
          {filteredCustomers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Tidak ada chat ditemukan
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCustomer?.id === customer.id ? "bg-green-50" : ""
                }`}
                onClick={() => handleCustomerSelect(customer)}
              >
                <img
                  src={customer.profilePic}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {customer.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {customer.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {customer.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <img
                  src={selectedCustomer.profilePic}
                  alt={selectedCustomer.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => goToDetailOrder(selectedCustomer.orderId)}
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  title="Lihat pesanan"
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
                    className={`flex ${
                      msg.sender === "Seller" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "Seller"
                          ? "bg-green-500 text-white rounded-tr-none"
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
                            {msg.status === "sent" && (
                              <FaCheck className="text-xs" />
                            )}
                            {msg.status === "read" && (
                              <FaCheckDouble className="text-xs text-blue-300" />
                            )}
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
                    onChange={(e) =>
                      handleCameraChange(URL.createObjectURL(e.target.files[0]))
                    }
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
                    placeholder="Ketik pesan Anda..."
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() && !file && !cameraImage}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                      message.trim() || file || cameraImage
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "text-gray-400"
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Tidak ada percakapan dipilih
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Pilih pelanggan dari sidebar untuk mulai mengobrol atau cari
                pelanggan menggunakan kolom pencarian.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;