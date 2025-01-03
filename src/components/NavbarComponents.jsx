import React, { useState } from 'react';
import { FaHeart, FaCommentDots, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { HiOutlineMenu } from 'react-icons/hi';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const handleCategoryClick = (category) => {
    console.log(`Category selected: ${category}`);
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchOpen(false); // Close search when mobile menu is toggled
  };

  return (
    <header className="bg-white rounded-[50px]">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo and Category */}
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png" // Replace with your logo path
            alt="Logo"
            className="w-10 h-10"
          />
          <div
            className="relative items-center space-x-2 cursor-pointer hidden md:flex"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <HiOutlineMenu className="text-gray-600 w-6 h-6" />
            <span className="text-gray-700 font-medium">Category</span>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-64 w-48 rounded-lg shadow-lg z-10">
                <ul className="py-4">
                  {['Category 1', 'Category 2', 'Category 3', 'Category 4'].map((category) => (
                    <li
                      key={category}
                      className="px-6 py-3 text-gray-700 hover:bg-green-100 cursor-pointer"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="flex-grow mx-6 relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-2">
            <FaSearch className="w-5 h-5" />
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <HiOutlineMenu className="text-gray-600 w-6 h-6 cursor-pointer" onClick={toggleMobileMenu} />
        </div>

        {/* Icons and Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <FaHeart className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />
          <FaCommentDots className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />
          <FaShoppingCart className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />
          <button className="text-green-600 font-medium hover:underline">Login</button>
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
{/* Mobile Menu */}
{isMobileMenuOpen && (
  <div className="md:hidden bg-white shadow-lg rounded-lg p-4">
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-medium">Category</span>
        <button onClick={toggleMobileMenu} className="text-gray-600">
          Close
        </button>
      </div>

      {/* Mobile Category List */}
      <ul className="py-2">
        {['Category 1', 'Category 2', 'Category 3', 'Category 4'].map((category) => (
          <li
            key={category}
            className="px-4 py-2 text-gray-700 hover:bg-green-100 cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </li>
        ))}
      </ul>

      {/* Mobile Search Bar */}
      <div className="relative mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-2">
          <FaSearch className="w-5 h-5" />
        </div>
      </div>

      {/* Mobile Icons and Buttons */}
      <div className="flex justify-between items-center mt-4">
        {/* Icons on the left */}
        <div className="flex space-x-6">
          <FaHeart className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />
          <FaCommentDots className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />
          <FaShoppingCart className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" />
        </div>

        {/* Buttons on the right */}
        <div className="flex space-x-4">
          <button className="text-green-600 font-medium hover:underline">Login</button>
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
    </div>
  </div>
)}

    </header>
  );
};

export default Navbar;
