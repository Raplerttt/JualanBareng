import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#80CBC4] shadow-md mt-10">
      <div className="container mx-auto py-8 px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src={logo} // Ganti dengan path logo Anda
            alt="Logo"
            className="w-14 h-auto"
          />
          <p className="mt-2 text-gray-600 text-sm font-medium">
            Belanja kecil, dampak besar
          </p>
        </div>

        {/* Right Section */}
        <div className="mt-4 md:mt-0 text-center md:text-right">
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
