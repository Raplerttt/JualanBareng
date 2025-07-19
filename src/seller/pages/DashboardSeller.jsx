import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/authContext';
import { AuthService } from '../../auth/authService';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import Dashboard from '../components/Dashboard';
import ProductsSection from '../components/ProductSection';
import ChatSection from '../ChatSection';
import OrdersSection from '../components/OrdersSection';
import SettingsSection from '../components/SettingsSection';
import SalesReportSection from '../components/SalesReportSection';

const DashboardSeller = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sellerData, setSellerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    AuthService.logout();
    logout();
    toast.success('Berhasil keluar');
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, ordersRes, categoriesRes, customersRes, vouchersRes, sellerRes] =
          await Promise.all([
            AuthService.getProducts(),
            AuthService.getOrders(),
            AuthService.getCategories(),
            AuthService.getCustomers(),
            AuthService.getVouchers(),
            AuthService.getSeller(),
          ]);

        setProducts(productsRes.data || []);
        setOrders(ordersRes.data || []);
        setCategories(categoriesRes.data || []);
        setCustomers(customersRes.data || []);
        setVouchers(vouchersRes.data || []);
        setSellerData(sellerRes.data || null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Gagal memuat data dari server';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative h-screen overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col h-full">
        <Header
          storeName={sellerData?.storeName || 'Toko'}
          products={products}
          orders={orders}
          toggleSidebar={toggleSidebar}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <main className="flex-1 overflow-y-auto p-4">
          {activeSection === 'dashboard' ? (
            <Dashboard products={products} orders={orders} categories={categories} />
          ) : activeSection === 'products' ? (
            <ProductsSection
              products={products}
              setProducts={setProducts}
              categories={categories}
              searchQuery={searchQuery}
              sortBy={sortBy}
            />
          ) : activeSection === 'orders' ? (
            <OrdersSection
              orders={orders}
              setOrders={setOrders}
              searchQuery={searchQuery}
              sortBy={sortBy}
            />
          ) : activeSection === 'chat' ? (
            <ChatSection
              customers={customers}
              setCustomers={setCustomers}
              messages={messages}
              setMessages={setMessages}
              user={user}
              searchQuery={searchQuery}
            />
          ) : activeSection === 'settings' ? (
            <SettingsSection
              vouchers={vouchers}
              setVouchers={setVouchers}
              sellerData={sellerData}
              setSellerData={setSellerData}
              searchQuery={searchQuery}
            />
          ) : activeSection === 'reports' ? (
            <SalesReportSection
              orders={orders}
              sellerData={sellerData}
              searchQuery={searchQuery}
            />
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p>Konten untuk seksi {activeSection} akan ditambahkan nanti.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardSeller;