import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto py-8 px-6 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col items-start">
          <img
            src="/logo.png" // Ganti dengan path logo Anda
            alt="Logo"
            className="w-16 h-16"
          />
          <p className="mt-2 text-gray-600 text-sm font-medium">
            Belanja kecil, dampak besar
          </p>
        </div>

        {/* Right Section */}
        <div className="text-right">
          <h4 className="text-gray-800 font-semibold">Follow Me</h4>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 mt-2 inline-block"
          >
            <FaInstagram className="w-6 h-6 hover:text-pink-500 transition" />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-100 text-center py-4">
        <p className="text-gray-500 text-sm">
          &copy; 2025 Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
