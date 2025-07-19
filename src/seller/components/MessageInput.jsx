import React, { useRef, useState } from 'react';
import { FaPaperclip, FaCamera } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi'; // ✅ Benar
import { motion } from 'framer-motion';

const MessageInput = ({ messages, setMessages, selectedCustomer, user }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const messageInputRef = useRef(null);

  const handleSendMessage = () => {
    if (!message.trim() && !file && !cameraImage) return;

    const newMessage = {
      sender: 'Seller',
      text: message.trim() || 'Lampiran',
      file,
      cameraImage,
      status: 'sent',
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newMessage]);
    setCustomers((prev) => {
      const updated = prev.filter((c) => c.id !== selectedCustomer.id);
      return [
        ...updated,
        {
          ...selectedCustomer,
          lastMessage: message.trim() || 'Lampiran',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ].sort((a, b) => b.chatId - a.chatId);
    });

    setMessage('');
    setFile(null);
    setCameraImage(null);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, status: 'read' } : msg))
      );
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {(file || cameraImage) && (
        <div className="mb-3 flex space-x-2">
          {file && (
            <div className="relative bg-gray-100 p-2 rounded-lg">
              <span className="text-sm">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
          {cameraImage && (
            <div className="relative">
              <img src={cameraImage} alt="Preview" className="h-16 rounded-md" />
              <button
                onClick={() => setCameraImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center space-x-2">
        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
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
            onChange={(e) => setCameraImage(URL.createObjectURL(e.target.files[0]))}
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
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'text-gray-400'
            } transition-colors`}
          >
            <FiSend size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;