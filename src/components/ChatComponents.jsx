import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPaperclip, FaCamera, FaCheck, FaCheckDouble, FaStore, FaEllipsisV } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../auth/authContext';
import { debounce } from 'lodash'; // Install lodash: `npm install lodash`

const ChatComponents = () => {
  const { user } = useContext(AuthContext);
  const { sellerId: paramSellerId } = useParams();
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sellers, setSellers] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const navigate = useNavigate();
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Ambil semua obrolan untuk mendapatkan daftar penjual unik
  useEffect(() => {
    let isMounted = true;
  
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('Admintoken') || localStorage.getItem('Usertoken') || localStorage.getItem('Sellertoken');
        if (!token || !user) {
          toast.error('Silakan login untuk melihat chat');
          navigate('/user/login');
          return;
        }
  
        const response = await axios.get('/chats', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!isMounted) return;
  
        const chatData = response.data.data || [];
        chatData.sort((a, b) => a.id - b.id);
  
        const sellerMap = new Map();
        chatData.forEach((chat) => {
          sellerMap.set(chat.sellerId, {
            id: chat.sellerId,
            name: chat.seller?.storeName || `Penjual ${chat.sellerId}`,
            profilePic: chat.seller?.photo || 'https://randomuser.me/api/portraits/lego/1.jpg',
            lastMessage: chat.message || '',
            time: chat.createdAt
              ? new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '',
            chatId: chat.id,
            orderId: chat.orderId || null,
          });
        });
  
        const uniqueSellers = Array.from(sellerMap.values()).sort((a, b) => a.chatId - b.chatId);
        setSellers(uniqueSellers);
  
        if (paramSellerId) {
          const autoSelected = uniqueSellers.find((s) => s.id === paramSellerId);
          if (autoSelected) {
            debouncedHandleSellerSelect(autoSelected);
          } else {
            // Fetch seller jika belum ada
            try {
              const sellerRes = await axios.get(`/seller/${paramSellerId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
  
              if (!isMounted) return;
  
              const sellerData = sellerRes.data.data;
              const fallbackSeller = {
                id: paramSellerId,
                name: sellerData.storeName || `Penjual ${paramSellerId}`,
                profilePic: sellerData.photo || 'https://randomuser.me/api/portraits/lego/1.jpg',
                lastMessage: '',
                time: '',
                chatId: null,
                orderId: null,
              };
  
              setSellers((prev) => [...prev, fallbackSeller]);
              debouncedHandleSellerSelect(fallbackSeller);
            } catch (err) {
              toast.error('Gagal memuat data penjual');
              console.error('Gagal memuat data penjual:', err);
            }
          }
        }
      } catch (err) {
        if (!isMounted) return;
        toast.error(err.response?.data?.message || 'Gagal memuat chat');
        console.error('Gagal memuat chat:', err);
      }
    };
  
    fetchChats();
    return () => {
      isMounted = false;
    };
  }, [navigate, user, paramSellerId]);
  

  // Pilih penjual otomatis berdasarkan paramSellerId
  useEffect(() => {
    if (paramSellerId && sellers.length > 0 && !selectedSeller) {
      const seller = sellers.find((s) => s.id === parseInt(paramSellerId));
      if (seller) {
        debouncedHandleSellerSelect(seller);
      }
    }
  }, [paramSellerId, sellers]);

  // Ambil pesan untuk penjual yang dipilih
  const handleSellerSelect = async (seller) => {
    setSelectedSeller(seller);
    setMessages([]);
    setIsLoadingMessages(true);
  
    try {
      const token = localStorage.getItem('Admintoken') || localStorage.getItem('Usertoken') || localStorage.getItem('Sellertoken');
      const response = await axios.get(`/chats?sellerId=${seller.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timestamp: new Date().getTime() },
      });
  
      const chatData = response.data.data || [];
      const filtered = chatData.filter((chat) => chat.sellerId === seller.id);
      filtered.sort((a, b) => a.id - b.id);
  
      const chatMessages = filtered.flatMap((chat) =>
        (chat.messages || []).map((msg) => ({
          sender: msg.senderType === 'USER' ? 'User' : 'Seller',
          text: msg.content,
          status: 'read',
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }))
      );
  
      setMessages(chatMessages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memuat pesan');
      console.error('Gagal memuat pesan:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };
  
  const debouncedHandleSellerSelect = debounce(handleSellerSelect, 300);
  

  // Ambil ulang pesan untuk penjual
  const refetchMessagesBySeller = async (seller) => {
    try {
      const token = localStorage.getItem('Admintoken');
      console.log('Mengambil ulang pesan untuk sellerId:', seller.id);
      const response = await axios.get(`/chats?sellerId=${seller.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timestamp: new Date().getTime() },
      });

      const chatData = response.data.data || [];
      const filteredChatData = chatData.filter((chat) => chat.sellerId === seller.id);
      filteredChatData.sort((a, b) => a.id - b.id);

      const chatMessages = filteredChatData.flatMap((chat) =>
        (chat.messages || []).map((msg) => ({
          sender: msg.senderType === 'USER' ? 'User' : 'Seller',
          text: msg.content,
          status: 'read',
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }))
      );

      setMessages(chatMessages);
      console.log('Pesan diambil ulang:', chatMessages);
    } catch (err) {
      console.error('Gagal mengambil ulang pesan:', err);
    }
  };

  // Kirim pesan
  const handleSendMessage = async () => {
    if (!message.trim() && !file && !cameraImage) return;

    const newMessage = {
      sender: 'User',
      text: message,
      file,
      cameraImage,
      status: 'sent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      const token = localStorage.getItem('Admintoken');
      let chatId = selectedSeller.chatId;

      if (!chatId) {
        const chatResponse = await axios.post(
          '/chats',
          {
            userId: user.id,
            sellerId: selectedSeller.id,
            message: message.trim() || 'Lampiran',
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newChat = chatResponse.data.data;
        chatId = newChat.id;

        const updatedSeller = {
          ...selectedSeller,
          chatId,
          lastMessage: newMessage.text,
          time: newMessage.time,
        };
        setSelectedSeller(updatedSeller);

        setSellers((prev) =>
          prev.map((s) => (s.id === selectedSeller.id ? updatedSeller : s))
        );

        await refetchMessagesBySeller(updatedSeller);
      } else {
        await axios.post(
          '/messages',
          {
            chatId,
            senderId: user.id,
            senderType: 'USER',
            content: message.trim() || 'Lampiran',
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessages((prev) => [...prev, newMessage]);

        setSellers((prev) =>
          prev.map((s) =>
            s.id === selectedSeller.id
              ? { ...s, lastMessage: newMessage.text, time: newMessage.time }
              : s
          )
        );
      }

      setMessage('');
      setFile(null);
      setCameraImage(null);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'Seller',
            text: 'Pesan diterima, terima kasih!',
            status: 'read',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim pesan');
      console.error('Gagal mengirim pesan:', err);
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

  // Gulir ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fokus ke input pesan saat penjual dipilih
  useEffect(() => {
    if (selectedSeller && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedSeller]);

  const filteredSellers = sellers.filter((seller) =>
    (seller.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Pesan</h2>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Cari penjual..."
              className="w-full p-2 pl-8 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-black-400"
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
          {filteredSellers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Tidak ada chat ditemukan</div>
          ) : (
            filteredSellers.map((seller) => (
              <div
                key={seller.id}
                className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedSeller?.id === seller.id ? 'bg-green-50' : ''
                }`}
                onClick={() => debouncedHandleSellerSelect(seller)}
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
            ))
          )}
        </div>
      </div>

      {/* Area Obrolan */}
      <div className="flex-1 flex flex-col">
        {selectedSeller ? (
          <>
            {/* Header Obrolan */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <img
                  src={`http://localhost:3000/${selectedSeller.profilePic}`}
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
                  title="Kunjungi toko"
                >
                  <FaStore size={18} />
                </button>
                <button className="text-gray-600 hover:text-green-600 transition-colors">
                  <FaEllipsisV size={18} />
                </button>
              </div>
            </div>

            {/* Pesan */}
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
                          {msg.sender === 'User' && (
                            <span className="ml-1">
                              {msg.status === 'sent' && <FaCheck className="text-xs" />}
                              {msg.status === 'read' && (
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
              )}
            </div>

            {/* Input Pesan */}
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
                    placeholder="Ketik pesan Anda..."
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada percakapan dipilih</h3>
              <p className="mt-2 text-sm text-gray-500">
                Pilih penjual dari sidebar untuk mulai mengobrol atau cari penjual menggunakan kolom pencarian.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponents;