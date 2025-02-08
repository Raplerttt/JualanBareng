import React, { useState } from 'react';
import { FaHeart, FaCommentDots, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { HiOutlineMenu } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);
  const handleCategoryClick = (category) => {
    console.log(`Category selected: ${category}`);
    setIsDropdownOpen(false);
  };
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-gray-200 rounded-full shadow-md">
      <div className="container mx-auto flex items-center justify-between py-3 px-5">
        <div className="flex items-center space-x-4">
          <img onClick={() => navigate('/')} src="/logo.png" alt="Logo" className="w-12 h-12 cursor-pointer" />
          <div className="relative hidden md:flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <HiOutlineMenu className="text-gray-600 w-6 h-6 cursor-pointer" />
            <span className="ml-2 text-gray-700 font-medium">Category</span>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-xl bg-white transform opacity-100 transition-all duration-300 ease-in-out translate-y-2 z-50">
                <ul className="py-2 rounded-lg border border-gray-300">
                  {['Category 1', 'Category 2', 'Category 3', 'Category 4'].map((category) => (
                    <li
                      key={category}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out rounded-lg"
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

        <div className="flex-grow mx-6 relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="hidden md:flex items-center space-x-5">
          <FaHeart className="text-gray-600 cursor-pointer hover:text-gray-800 transition duration-200 ease-in-out" onClick={() => navigate('/favorite')} />
          <FaCommentDots className="text-gray-600 cursor-pointer hover:text-gray-800 transition duration-200 ease-in-out" onClick={() => navigate('/chat')} />
          <FaShoppingCart className="text-gray-600 cursor-pointer hover:text-gray-800 transition duration-200 ease-in-out" onClick={() => navigate('/cart')} />
          <button onClick={() => navigate('/user/login')} className="text-[#024CAA] font-medium hover:underline">Login</button>
          <button onClick={() => navigate('/user/register')} className="px-4 py-2 rounded-lg text-[#DBD3D3] bg-gradient-to-r from-[#091057] to-[#024CAA] font-medium">Register</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
