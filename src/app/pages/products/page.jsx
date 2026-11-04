'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiSearch } from 'react-icons/fi';
import Navbar from '@/src/components/Navbar';

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    frameType: '',
    search: '',
  });
  const controls = useAnimation();
  const searchInputRef = useRef(null);

  const fetchProducts = async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);
      controls.start({
        opacity: 0,
        transition: { duration: 0.3 },
      });

      const queryParams = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...filterParams,
      }).toString();

      const response = await fetch(`/api/productcard?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
        setError(null);

        const initialIndices = {};
        data.products.forEach((product) => {
          initialIndices[product._id] = 0;
        });
        setActiveImageIndex(initialIndices);

        controls.start({
          opacity: 1,
          transition: { duration: 0.5 },
        });
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, filters);
  }, [filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, filters);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(1, filters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      gender: '',
      frameType: '',
      search: '',
    });
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  const handleNextImage = (productId) => {
    setActiveImageIndex((prev) => {
      const product = products.find((p) => p._id === productId);
      const currentIndex = prev[productId];
      const nextIndex = (currentIndex + 1) % product.images.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const handlePrevImage = (productId) => {
    setActiveImageIndex((prev) => {
      const product = products.find((p) => p._id === productId);
      const currentIndex = prev[productId];
      const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const loadingSkeleton = Array.from({ length: pagination.limit }).map((_, index) => (
    <motion.div
      key={index}
      variants={item}
      className="border rounded-xl overflow-hidden shadow-sm bg-white/50 backdrop-blur-sm"
    >
      <div className="relative h-64 bg-gray-200 animate-pulse rounded-t-xl"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded-full w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
        <div className="h-3-4 bg-gray-200 rounded-full w-1/3"></div>
        <div className="flex justify-between mt-3">
          <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
      </div>
    </motion.div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-600 mb-4">Discover Our Collection</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Explore our premium selection of products designed to elevate your experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Eyeglasses">Eyeglasses</option>
                <option value="Sunglasses">Sunglasses</option>
                <option value="Contact Lenses">Contact Lenses</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genders</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frame Type</label>
              <select
                name="frameType"
                value={filters.frameType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Frame Types</option>
                <option value="Full Rim">Full Rim</option>
                <option value="Half Rim">Half Rim</option>
                <option value="Rimless">Rimless</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    ref={searchInputRef}
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by name or brand..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply
              </motion.button>
            </div>
          </form>
          {(filters.category || filters.gender || filters.frameType || filters.search) && (
            <motion.button
              onClick={handleClearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Clear Filters
            </motion.button>
          )}
        </motion.div>

        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-100 border border-red-300 text-red-700 px-4 py-4 rounded-lg text-center max-w-md mx-auto"
          >
            <p className="mb-3">{error}</p>
            <button
              onClick={() => fetchProducts(pagination.currentPage, filters)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm"
            >
              Retry
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate={loading ? 'hidden' : 'visible'}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {loading ? (
                  loadingSkeleton
                ) : (
                  products.map((product) => (
                    <motion.div
                      key={product._id}
                      variants={item}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <Link href="/products/${product._id}">
                        <div className="relative h-36">
                          {product.images && product.images.length > 0 ? (
                            <>
                              <Image
                                src={product.images[activeImageIndex[product._id]]?.url || '/placeholder-image.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 25vw"
                              />
                              {product.images.length > 1 && (
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                                  {product.images.map((_, i) => (
                                    <button
                                      key={i}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setActiveImageIndex((prev) => ({
                                          ...prev,
                                          [product._id]: i,
                                        }));
                                      }}
                                      className={`w-2 h-2 rounded-full ${activeImageIndex[product._id] === i ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="h-full bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                          {product.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePrevImage(product._id);
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                              >
                                <FiChevronLeft />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNextImage(product._id);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                              >
                                <FiChevronRight />
                              </button>
                            </>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between mb-2">
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <span className="text-blue-600">₹${product.price.toFixed(2)}</span>
                          </div>
                          <div className="flex gap-2 mb-2">
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{product.category}</span>
                            {product.brand && (
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">{product.brand}</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">
                              ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4"
            >
              <div className="text-sm text-gray-600">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1}-
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} of
                {pagination.totalProducts} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || loading}
                  className={`px-4 py-2 rounded-md ${pagination.currentPage === 1 || loading ? 'bg-gray-200' : 'bg-blue-100 hover:bg-blue-200'}`}
                >
                  <FiChevronLeft />
                </button>
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-md ${pagination.currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                  <>
                    <span className="px-2 text-gray-600">...</span>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className="px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200"
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || loading}
                  className={`px-4 py-2 rounded-md ${pagination.currentPage === pagination.totalPages || loading ? 'bg-gray-200' : 'bg-blue-100 hover:bg-blue-200'}`}
                >
                  <FiChevronRight />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
