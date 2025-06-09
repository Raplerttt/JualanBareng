import React from 'react';
import Sidebar from '../components/SidebarComponents';
import AdminRoutes from '../route/RouteAdmin';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <AdminRoutes />
      </main>
    </div>
  );
};

export default AdminLayout;
