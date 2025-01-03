import React, { useState } from 'react';

const ChatComponents = () => {
  const [selectedSeller, setSelectedSeller] = useState(null); // Seller yang dipilih
  const [message, setMessage] = useState(""); // Pesan yang diketik user
  const [messages, setMessages] = useState([]); // Daftar pesan yang ada

  const sellers = [
    { id: 1, name: 'Seller 1', profilePic: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Seller 2', profilePic: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Seller 3', profilePic: 'https://via.placeholder.com/50' },
  ];

  // Fungsi untuk memilih seller
  const handleSellerSelect = (seller) => {
    setSelectedSeller(seller);
    setMessages([]); // Reset pesan saat memilih seller baru
  };

  // Fungsi untuk mengirim pesan
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: 'User', text: message }]);
      setMessage(""); // Reset input pesan
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Kiri */}
      <div className="w-1/4 bg-white shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">Daftar Seller</h2>
        <ul>
          {sellers.map((seller) => (
            <li
              key={seller.id}
              className={`flex items-center p-2 mb-4 rounded-lg cursor-pointer hover:bg-green-100 ${
                selectedSeller?.id === seller.id ? 'bg-green-200' : ''
              }`}
              onClick={() => handleSellerSelect(seller)}
            >
              <img
                src={seller.profilePic}
                alt={seller.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <span className="text-gray-700">{seller.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ruang Chat (Bagian Kanan) */}
      <div className="w-3/4 bg-white p-4 flex flex-col">
        {selectedSeller ? (
          <>
            {/* Profil dan Nama Seller */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={selectedSeller.profilePic}
                alt={selectedSeller.name}
                className="w-12 h-12 rounded-full"
              />
              <span className="text-xl font-semibold">{selectedSeller.name}</span>
            </div>

            {/* Chat Room */}
            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-xs ${msg.sender === 'User' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Pesan */}
            <div className="flex items-center space-x-4">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan..."
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Kirim
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center flex-1 text-gray-500">
            <span>Pilih seller untuk memulai percakapan.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponents;
