import React, { useState } from 'react';
import { FaHeart, FaCommentDots, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { HiOutlineMenu } from 'react-icons/hi';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const handleCategoryClick = (category) => {
    // Handle category click (you can log or navigate to the selected category)
    console.log(`Category selected: ${category}`);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <header className="bg-white rounded-[50px]">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo and Category */}
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png" // Ganti dengan path logo Anda
            alt="Logo"
            className="w-10 h-10"
          />
          <div
            className="relative flex items-center space-x-2 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <HiOutlineMenu className="text-gray-600 w-6 h-6" />
            <span className="text-gray-700 font-medium">Category</span>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-64 w-48 rounded-lg shadow-lg z-10">
                <ul className="py-4">
                  <li
                    className="px-6 py-3 text-gray-700 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleCategoryClick('Category 1')}
                  >
                    Category 1
                  </li>
                  <li
                    className="px-6 py-3 text-gray-700 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleCategoryClick('Category 2')}
                  >
                    Category 2
                  </li>
                  <li
                    className="px-6 py-3 text-gray-700 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleCategoryClick('Category 3')}
                  >
                    Category 3
                  </li>
                  <li
                    className="px-6 py-3 text-gray-700 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleCategoryClick('Category 4')}
                  >
                    Category 4
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-6 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          
          {/* Search Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-2">
            <FaSearch className="w-5 h-5" />
          </div>
        </div>

        {/* Icons and Buttons */}
        <div className="flex items-center space-x-6">
          {/* Icons */}
          <FaHeart className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />
          <FaCommentDots className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />
          <FaShoppingCart className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />

          {/* Login and Register Buttons */}
          <button className="text-green-600 font-medium hover:underline">
            Login
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{
              background: 'linear-gradient(90deg, #47EE54, #54A05A)',
            }}
          >
            Register
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
