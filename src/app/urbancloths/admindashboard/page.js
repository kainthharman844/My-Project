// pages/admin/dashboard.js or app/admin/dashboard/page.js (add "use client" for App Router)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineDotsVertical,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCash,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlinePhotograph,
  HiOutlineTag,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineUpload,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineExclamation,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineArrowUp,
  HiOutlineArrowDown
} from 'react-icons/hi';

export default function AdminDashboard() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order received #1234', time: '2 min ago', type: 'order' },
    { id: 2, text: 'Low stock alert: Urban Hoodie', time: '1 hour ago', type: 'alert' },
    { id: 3, text: 'New customer registered', time: '3 hours ago', type: 'user' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dummy data
  const [stats, setStats] = useState({
    totalRevenue: 245000,
    totalOrders: 1420,
    totalProducts: 350,
    totalCustomers: 8920,
    revenueChange: 12.5,
    ordersChange: 8.2,
    productsChange: -2.4,
    customersChange: 15.7
  });

  const [products, setProducts] = useState([
    {
      _id: '1',
      name: 'Urban Shadow Hoodie',
      category: 'Hoodies',
      price: 89.99,
      stock: 45,
      sold: 230,
      status: 'active',
      image: '/api/placeholder/100/100',
      rating: 4.8,
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      name: 'Street Force Sneakers',
      category: 'Sneakers',
      price: 129.99,
      stock: 12,
      sold: 180,
      status: 'low_stock',
      image: '/api/placeholder/100/100',
      rating: 4.9,
      createdAt: '2024-01-20'
    },
    {
      _id: '3',
      name: 'Rebel Denim Jacket',
      category: 'Jackets',
      price: 149.99,
      stock: 0,
      sold: 95,
      status: 'out_of_stock',
      image: '/api/placeholder/100/100',
      rating: 4.7,
      createdAt: '2024-02-01'
    },
    {
      _id: '4',
      name: 'City Lights Tee',
      category: 'T-Shirts',
      price: 49.99,
      stock: 150,
      sold: 420,
      status: 'active',
      image: '/api/placeholder/100/100',
      rating: 4.5,
      createdAt: '2024-02-10'
    },
    {
      _id: '5',
      name: 'Urban Camo Pants',
      category: 'Pants',
      price: 99.99,
      stock: 35,
      sold: 145,
      status: 'active',
      image: '/api/placeholder/100/100',
      rating: 4.6,
      createdAt: '2024-02-15'
    }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      _id: 'ORD-001',
      customer: 'John Doe',
      product: 'Urban Shadow Hoodie',
      amount: 89.99,
      status: 'completed',
      date: '2024-03-15'
    },
    {
      _id: 'ORD-002',
      customer: 'Jane Smith',
      product: 'Street Force Sneakers',
      amount: 129.99,
      status: 'processing',
      date: '2024-03-14'
    },
    {
      _id: 'ORD-003',
      customer: 'Mike Johnson',
      product: 'Rebel Denim Jacket',
      amount: 149.99,
      status: 'pending',
      date: '2024-03-13'
    },
    {
      _id: 'ORD-004',
      customer: 'Sarah Wilson',
      product: 'City Lights Tee',
      amount: 49.99,
      status: 'completed',
      date: '2024-03-12'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: ''
  });

  // Chart data (simplified)
  const salesData = [
    { month: 'Jan', sales: 45000 },
    { month: 'Feb', sales: 52000 },
    { month: 'Mar', sales: 48000 },
    { month: 'Apr', sales: 61000 },
    { month: 'May', sales: 55000 },
    { month: 'Jun', sales: 67000 }
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const product = {
      _id: Date.now().toString(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      sold: 0,
      status: parseInt(newProduct.stock) > 0 ? 'active' : 'out_of_stock',
      image: '/api/placeholder/100/100',
      rating: 0,
      createdAt: new Date().toISOString()
    };
    
    setProducts([product, ...products]);
    setShowAddModal(false);
    setNewProduct({ name: '', category: '', price: '', stock: '', description: '', image: '' });
    setIsLoading(false);
    
    // Add notification
    setNotifications([
      { id: Date.now(), text: `Product "${product.name}" added successfully`, time: 'Just now', type: 'success' },
      ...notifications
    ]);
  };

  const handleDeleteProduct = async (productId) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(products.filter(p => p._id !== productId));
    setShowDeleteModal(false);
    setSelectedProduct(null);
    setIsLoading(false);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      image: product.image
    });
    setShowAddModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'low_stock': return 'bg-yellow-500';
      case 'out_of_stock': return 'bg-red-500';
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarLinks = [
    { id: 'dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { id: 'products', icon: HiOutlineCube, label: 'Products' },
    { id: 'orders', icon: HiOutlineShoppingBag, label: 'Orders' },
    { id: 'customers', icon: HiOutlineUsers, label: 'Customers' },
    { id: 'analytics', icon: HiOutlineChartBar, label: 'Analytics' },
    { id: 'settings', icon: HiOutlineCog, label: 'Settings' }
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'
    }`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#2A2A2A' : '#E5E5E5'};
          border-radius: 3px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-pulse-custom {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed lg:relative z-40 w-64 h-screen border-r ${
              isDarkMode ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]'
            }`}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-[#2A2A2A] dark:border-[#E5E5E5]">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  <span className="text-[#E71D2B]">URBAN</span>
                  <span className={isDarkMode ? 'text-white' : 'text-[#111111]'}>GEAR</span>
                </h1>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  className={`p-1 rounded-lg ${
                    isDarkMode ? 'hover:bg-[#0A0A0A]' : 'hover:bg-[#F5F5F5]'
                  }`}
                >
                  <HiOutlineX className={isDarkMode ? 'text-white' : 'text-[#111111]'} size={20} />
                </motion.button>
              </div>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                Admin Dashboard
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1">
              {sidebarLinks.map((link) => (
                <motion.button
                  key={link.id}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === link.id
                      ? 'bg-[#E71D2B] text-white shadow-lg shadow-[#E71D2B]/20'
                      : isDarkMode
                        ? 'text-[#B0B0B0] hover:bg-[#0A0A0A] hover:text-white'
                        : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]'
                  }`}
                >
                  <link.icon size={20} />
                  <span className="font-medium">{link.label}</span>
                  {link.id === 'orders' && (
                    <span className="ml-auto bg-[#E71D2B] text-white text-xs px-2 py-0.5 rounded-full">
                      5
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2A2A] dark:border-[#E5E5E5]">
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isDarkMode
                    ? 'text-[#B0B0B0] hover:bg-[#0A0A0A] hover:text-[#E71D2B]'
                    : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#E71D2B]'
                }`}
              >
                <HiOutlineLogout size={20} />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className={`sticky top-0 z-30 border-b ${
          isDarkMode ? 'bg-[#0A0A0A]/90 border-[#2A2A2A]' : 'bg-white/90 border-[#E5E5E5]'
        } backdrop-blur-md`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'hover:bg-[#151515] text-white' : 'hover:bg-[#F5F5F5] text-[#111111]'
                  }`}
                >
                  <HiOutlineMenu size={24} />
                </motion.button>
              )}
              
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <HiOutlineSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                }`} size={20} />
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-xl border transition-all outline-none w-80 ${
                    isDarkMode
                      ? 'bg-[#151515] border-[#2A2A2A] text-white focus:border-[#E71D2B]'
                      : 'bg-[#F5F5F5] border-[#E5E5E5] text-[#111111] focus:border-[#E71D2B]'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'hover:bg-[#151515] text-white' : 'hover:bg-[#F5F5F5] text-[#111111]'
                }`}
              >
                {isDarkMode ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg relative ${
                    isDarkMode ? 'hover:bg-[#151515] text-white' : 'hover:bg-[#F5F5F5] text-[#111111]'
                  }`}
                >
                  <HiOutlineBell size={20} />
                  <span className="absolute -top-1 -right-1 bg-[#E71D2B] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-80 rounded-xl border shadow-2xl ${
                        isDarkMode ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]'
                      }`}
                    >
                      <div className="p-4">
                        <h3 className={`font-semibold mb-3 ${
                          isDarkMode ? 'text-white' : 'text-[#111111]'
                        }`}>
                          Notifications
                        </h3>
                        <div className="space-y-3">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 rounded-lg ${
                                isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'
                              }`}
                            >
                              <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                                {notif.text}
                              </p>
                              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                                {notif.time}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-gradient-to-br from-[#E71D2B] to-[#FF4D5A] rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
              >
                A
              </motion.div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          {/* Stats Grid */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8">
                <h2 className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-[#111111]'
                }`}>
                  Dashboard Overview
                </h2>
                <p className={isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}>
                  Welcome back, Admin! Here's what's happening today.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    title: 'Total Revenue',
                    value: `$${stats.totalRevenue.toLocaleString()}`,
                    change: stats.revenueChange,
                    icon: HiOutlineCash,
                    color: '#E71D2B'
                  },
                  {
                    title: 'Total Orders',
                    value: stats.totalOrders.toLocaleString(),
                    change: stats.ordersChange,
                    icon: HiOutlineClipboardList,
                    color: '#3B82F6'
                  },
                  {
                    title: 'Products',
                    value: stats.totalProducts.toLocaleString(),
                    change: stats.productsChange,
                    icon: HiOutlineCube,
                    color: '#10B981'
                  },
                  {
                    title: 'Customers',
                    value: stats.totalCustomers.toLocaleString(),
                    change: stats.customersChange,
                    icon: HiOutlineUsers,
                    color: '#F59E0B'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-[20px] border transition-all ${
                      isDarkMode
                        ? 'bg-[#151515] border-[#2A2A2A] hover:border-[#E71D2B]/50'
                        : 'bg-white border-[#E5E5E5] hover:border-[#E71D2B]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: stat.color + '20' }}>
                        <stat.icon size={24} style={{ color: stat.color }} />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change >= 0 ? <HiOutlineTrendingUp size={16} /> : <HiOutlineTrendingDown size={16} />}
                        <span>{Math.abs(stat.change)}%</span>
                      </div>
                    </div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Sales Chart (Simplified) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-[20px] border ${
                    isDarkMode ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]'
                  }`}
                >
                  <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                    Sales Overview
                  </h3>
                  <div className="flex items-end space-x-2 h-48">
                    {salesData.map((data, index) => (
                      <div key={data.month} className="flex-1 flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.sales / 67000) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-[#E71D2B] to-[#FF4D5A] rounded-t-lg"
                        />
                        <span className={`text-xs mt-2 ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                          {data.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-[20px] border ${
                    isDarkMode ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]'
                  }`}
                >
                  <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                    Recent Orders
                  </h3>
                  <div className="space-y-3">
                    {recentOrders.map((order, index) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`} />
                          <div>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                              {order.customer}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                              {order.product}
                            </p>
                          </div>
                        </div>
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                          ${order.amount}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Products Management */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-[#111111]'
                  }`}>
                    Products Management
                  </h2>
                  <p className={isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}>
                    Manage your product catalog
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedProduct(null);
                    setNewProduct({ name: '', category: '', price: '', stock: '', description: '', image: '' });
                    setShowAddModal(true);
                  }}
                  className="px-6 py-3 bg-[#E71D2B] text-white rounded-xl font-semibold hover:bg-[#FF4D5A] transition-colors shadow-lg shadow-[#E71D2B]/20 flex items-center space-x-2"
                >
                  <HiOutlinePlus size={20} />
                  <span>Add Product</span>
                </motion.button>
              </div>

              {/* Products Table */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`rounded-[20px] border overflow-hidden ${
                  isDarkMode ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]'
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={isDarkMode ? 'border-b border-[#2A2A2A]' : 'border-b border-[#E5E5E5]'}>
                        <th className={`text-left p-4 text-sm font-medium ${
                          isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                        }`}>
                          Product
                        </th>
                        <th className={`text-left p-4 text-sm font-medium ${
                          isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                        }`}>
                          Category
                        </th>
                        <th className={`text-left p-4 text-sm font-medium ${
                          isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                        }`}>
                          Price
                        </th>
                        <th className={`text-left p-4 text-sm font-medium ${
                          isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                        }`}>
                          Stock
                        </th>
                        <th className={`text-left p-4 text-sm font-medium ${
                          isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                        }`}>
                          Status
                        </th>
                        <th className={`text-left p-4 text-sm font-medium ${
                          isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                        }`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border-b transition-colors ${
                            isDarkMode
                              ? 'border-[#2A2A2A] hover:bg-[#0A0A0A]'
                              : 'border-[#E5E5E5] hover:bg-[#F5F5F5]'
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                                  {product.name}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                                  SKU: {product._id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className={`p-4 ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                            {product.category}
                          </td>
                          <td className={`p-4 font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                            ${product.price}
                          </td>
                          <td className={`p-4 ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                            {product.stock}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(product.status)}`}>
                              {getStatusText(product.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditProduct(product)}
                                className={`p-2 rounded-lg ${
                                  isDarkMode ? 'hover:bg-[#151515] text-[#B0B0B0]' : 'hover:bg-[#E5E5E5] text-[#666666]'
                                }`}
                              >
                                <HiOutlinePencil size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                              >
                                <HiOutlineTrash size={18} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-[20px] border ${
                isDarkMode ? 'bg-[#151515] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-[#111111]'
                  }`}>
                    {selectedProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddModal(false)}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'hover:bg-[#0A0A0A] text-[#B0B0B0]' : 'hover:bg-[#F5F5F5] text-[#666666]'
                    }`}