import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/verifikasi-pendaftaran', icon: '📊', label: 'Verifikasi Pendaftaran' },
    { path: '/admin/bug-reports', icon: '🐛', label: 'Pengaduan' },
    { path: '/admin/settings', icon: '⚙️', label: 'Pengaturan' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed flex flex-col justify-between">
      <div>
        <div className="p-5 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-lg ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-gray-800'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-5 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-lg hover:bg-gray-800 rounded-md transition"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
