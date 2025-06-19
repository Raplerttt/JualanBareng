import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/bug-reports', icon: '🐛', label: 'Laporan Bug' },
    { path: '/admin/settings', icon: '⚙️', label: 'Pengaturan' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed">
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
                isActive 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-800'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;