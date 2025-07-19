import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBox,
  FaList,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaStore,
  FaTimes,
  FaChartBar,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  activeSection,
  setActiveSection,
}) => {
  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', section: 'dashboard' },
    { icon: <FaBox />, label: 'Produk', section: 'products' },
    { icon: <FaList />, label: 'Order', section: 'orders' },
    { icon: <FaComments />, label: 'Chat', section: 'chat' },
    { icon: <FaCog />, label: 'Setting', section: 'settings' },
    { icon: <FaChartBar />, label: 'Laporan', section: 'reports' },
  ];
  const navigate = useNavigate();

  // Hanya tutup sidebar jika layar mobile
  const closeIfMobile = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('Admintoken');
    navigate('/seller/login');
  };
  
  return (
    <>
      {/* Overlay mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen || window.innerWidth >= 768 ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 left-0 h-screen w-64 bg-[#80CBC4]/90 backdrop-blur-md text-black shadow-xl z-50 md:static md:translate-x-0 md:bg-[#80CBC4]/90 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-black/10">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow">
              <FaStore className="text-indigo-700 text-xl" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Seller Hub</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-black hover:text-gray-700 focus:outline-none"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSection(item.section);
                closeIfMobile();
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left rounded-r-full transition-all duration-200 ${
                activeSection === item.section
                  ? 'bg-[#3fcec0] font-semibold shadow'
                  : 'hover:bg-[#3fcec0]/60'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t border-black/10 px-6 py-4">
          <button
            onClick={() => {
              handleLogout();
              closeIfMobile();
            }}
            className="flex items-center gap-3 text-left text-red-700 hover:text-red-900 transition w-full"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-base">Logout</span>
          </button>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-gray-600 py-3">v1.0.0</div>
      </motion.aside>
    </>
  );
};

export default Sidebar;