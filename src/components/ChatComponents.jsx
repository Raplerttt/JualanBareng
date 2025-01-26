import React, { useState } from 'react';
import { FaPaperclip, FaImage, FaCamera } from 'react-icons/fa'; // Importing camera icon
import Webcam from 'react-webcam'; // Import Webcam library

const ChatComponents = () => {
  const [selectedSeller, setSelectedSeller] = useState(null); // Seller yang dipilih
  const [message, setMessage] = useState(""); // Pesan yang diketik user
  const [messages, setMessages] = useState([]); // Daftar pesan yang ada
  const [file, setFile] = useState(null); // Untuk menyimpan lampiran file
  const [image, setImage] = useState(null); // Untuk menyimpan gambar
  const [cameraImage, setCameraImage] = useState(null); // Untuk menyimpan gambar dari kamera

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
    if (message.trim() || file || image || cameraImage) {
      setMessages([
        ...messages,
        { sender: 'User', text: message, file, image, cameraImage },
      ]);
      setMessage(""); // Reset input pesan
      setFile(null); // Reset lampiran file
      setImage(null); // Reset gambar
      setCameraImage(null); // Reset foto kamera
    }
  };

  // Fungsi untuk menangani pemilihan file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fungsi untuk menangani pemilihan gambar
  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0])); // Menampilkan gambar sementara
  };

  // Fungsi untuk menangani foto kamera
  const handleCameraChange = (imageSrc) => {
    setCameraImage(imageSrc); // Menyimpan gambar kamera
  };

  return (
    <div className=" mx-auto py-8">
      <div className="flex flex-col md:flex-row bg-gray-100 rounded-lg shadow-md overflow-hidden">
        {/* Sidebar Kiri */}
        <div className="w-full md:w-1/4 bg-white shadow-lg p-4">
          <h2 className="text-lg font-bold mb-4 text-center">CHAT</h2>
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
        <div className="w-full md:w-3/4 bg-white p-4 flex flex-col">
          {selectedSeller ? (
            <>
              {/* Profil dan Nama Seller */}
              <div className="flex items-center space-x-3 mb-4 justify-end">
                <span className="text-xl font-semibold">{selectedSeller.name}</span>
                <img
                  src={selectedSeller.profilePic}
                  alt={selectedSeller.name}
                  className="w-12 h-12 rounded-full"
                />
              </div>

              {/* Chat Room */}
              <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg shadow-inner min-h-[300px]">
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
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Image"
                            className="mt-2 max-w-xs rounded-md"
                          />
                        )}
                        {msg.cameraImage && (
                          <img
                            src={msg.cameraImage}
                            alt="Camera"
                            className="mt-2 max-w-xs rounded-md"
                          />
                        )}
                        {msg.file && (
                          <a
                            href={URL.createObjectURL(msg.file)}
                            download
                            className="block mt-2 text-blue-500"
                          >
                            Download file
                          </a>
                        )}
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
                <div className="flex items-center space-x-2">
                  {/* Lampiran File */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <FaPaperclip className="text-2xl text-gray-500 hover:text-gray-700" />
                  </label>

                  {/* Kamera */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="camera"
                      onChange={(e) => handleCameraChange(URL.createObjectURL(e.target.files[0]))}
                      className="hidden"
                    />
                    <FaCamera className="text-2xl text-gray-500 hover:text-gray-700" />
                  </label>

                  {/* Button Kirim */}
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Kirim
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center flex-1 text-gray-500">
              <span>Pilih seller untuk memulai percakapan.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponents;
