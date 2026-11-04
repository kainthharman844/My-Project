'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiSearch, FiShoppingCart, FiHeart } from 'react-icons/fi';

export default function ProductsPage() {
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
    size: '',
    search: '',
  });
  const controls = useAnimation();

  const fetchProducts = async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);
      controls.start({ opacity: 0, transition: { duration: 0.3 } });

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

        controls.start({ opacity: 1, transition: { duration: 0.5 } });
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on initial load
  useEffect(() => {
    fetchProducts(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Auto-fetch on select change (except for text search)
    if (e.target.tagName === 'SELECT') {
      fetchProducts(1, newFilters);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(1, filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { category: '', gender: '', size: '', search: '' };
    setFilters(clearedFilters);
    fetchProducts(1, clearedFilters);
  };

  const handleNextImage = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => {
      const product = products.find((p) => p._id === productId);
      const currentIndex = prev[productId];
      const nextIndex = (currentIndex + 1) % product.images.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const handlePrevImage = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => {
      const product = products.find((p) => p._id === productId);
      const currentIndex = prev[productId];
      const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`${product.name} added to wishlist`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: 'beforeChildren' },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const loadingSkeleton = Array.from({ length: pagination.limit }).map((_, index) => (
    <motion.div
      key={index}
      variants={item}
      className="rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
    >
      <div className="relative aspect-square bg-neutral-800 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-800 rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-neutral-800 rounded-full w-1/2 animate-pulse" />
        <div className="h-3 bg-neutral-800 rounded-full w-1/3 animate-pulse" />
        <div className="flex justify-between mt-4">
          <div className="h-5 bg-neutral-800 rounded-full w-1/4 animate-pulse" />
          <div className="h-5 bg-neutral-800 rounded-full w-1/3 animate-pulse" />
        </div>
      </div>
    </motion.div>
  ));

  const hasActiveFilters = filters.category || filters.gender || filters.size || filters.search;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-[100px]">

      {/* ── HERO HEADER ── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-rose-400/10 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="text-center"
          >
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-bold tracking-widest uppercase">
              The Collection
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.95]">
              SHOP THE <span className="text-amber-400">DROP</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
              Premium urban apparel built for comfort, movement, and everyday city life.
              Filter, sort, and find your fit.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {/* ── FILTERS ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 bg-neutral-900 rounded-2xl border border-white/5 p-5 sm:p-6"
        >
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all"
              >
                <option value="">All Categories</option>
                <option value="Hoodies">Hoodies</option>
                <option value="Tees">Tees</option>
                <option value="Jackets">Jackets</option>
                <option value="Joggers">Joggers</option>
                <option value="Denim">Denim</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all"
              >
                <option value="">All Genders</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Size
              </label>
              <select
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all"
              >
                <option value="">All Sizes</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Hoodie, jacket..."
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>

            <div className="flex items-end">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-4 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-sm hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
              >
                <FiSearch className="w-4 h-4" />
                Apply Search
              </motion.button>
            </div>
          </form>

          {hasActiveFilters && (
            <motion.button
              onClick={handleClearFilters}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors"
            >
              Clear Filters ×
            </motion.button>
          )}
        </motion.div>

        {/* ── RESULTS ── */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl max-w-md mx-auto text-center"
          >
            <p className="mb-3">{error}</p>
            <button
              onClick={() => fetchProducts(pagination.currentPage, filters)}
              className="mt-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-5 rounded-full text-sm transition-colors"
            >
              Retry
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate={loading ? 'hidden' : 'show'}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="wait">
                {loading
                  ? loadingSkeleton
                  : products.map((product) => (
                      <motion.div
                        key={product._id}
                        variants={item}
                        whileHover={{ y: -6 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-400/40 transition-colors flex flex-col"
                      >
                        <Link href={`/products/${product._id}`} className="block flex-1">
                          <div className="relative aspect-square bg-neutral-800 overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <>
                                <motion.div
                                  whileHover={{ scale: 1.08 }}
                                  transition={{ duration: 0.5 }}
                                  className="absolute inset-0"
                                >
                                  <Image
                                    src={product.images[activeImageIndex[product._id]]?.url || '/placeholder-product.jpg'}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    priority={products.indexOf(product) < 4}
                                  />
                                </motion.div>

                                {/* hover overlay with quick actions */}
                                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                  <motion.button
                                    initial={{ y: 12, opacity: 0 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="bg-white hover:bg-amber-400 text-neutral-950 p-3 rounded-full shadow-lg transition-colors"
                                    aria-label="Add to cart"
                                  >
                                    <FiShoppingCart className="w-5 h-5" />
                                  </motion.button>
                                  <motion.button
                                    initial={{ y: 12, opacity: 0 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.05 }}
                                    onClick={(e) => handleAddToWishlist(e, product)}
                                    className="bg-white hover:bg-amber-400 text-neutral-950 p-3 rounded-full shadow-lg transition-colors"
                                    aria-label="Add to wishlist"
                                  >
                                    <FiHeart className="w-5 h-5" />
                                  </motion.button>
                                </div>

                                {/* image dots */}
                                {product.images.length > 1 && (
                                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                    {product.images.map((_, idx) => (
                                      <button
                                        key={idx}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setActiveImageIndex((prev) => ({ ...prev, [product._id]: idx }));
                                        }}
                                        className={`h-1.5 rounded-full transition-all ${
                                          activeImageIndex[product._id] === idx
                                            ? 'bg-amber-400 w-5'
                                            : 'bg-white/50 w-1.5'
                                        }`}
                                        aria-label={`View image ${idx + 1}`}
                                      />
                                    ))}
                                  </div>
                                )}

                                {/* arrows */}
                                {product.images.length > 1 && (
                                  <>
                                    <button
                                      onClick={(e) => handlePrevImage(e, product._id)}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-neutral-950/70 hover:bg-amber-400 hover:text-neutral-950 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"
                                      aria-label="Previous image"
                                    >
                                      <FiChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => handleNextImage(e, product._id)}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-950/70 hover:bg-amber-400 hover:text-neutral-950 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"
                                      aria-label="Next image"
                                    >
                                      <FiChevronRight className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-neutral-500 text-sm">No Image</span>
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h2 className="text-base font-bold text-white line-clamp-2 leading-tight">
                                {product.name}
                              </h2>
                              <span className="text-lg font-black text-amber-400 whitespace-nowrap">
                                ₹{Number(product.price).toFixed(0)}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-3">
                              <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-amber-400/10 text-amber-300 rounded-full font-bold">
                                {product.category}
                              </span>
                              {product.brand && (
                                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-white/5 text-neutral-400 rounded-full font-bold">
                                  {product.brand}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < Math.round(product.rating || 0)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-neutral-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-neutral-500">
                                ({product.numReviews || 0})
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
              </AnimatePresence>
            </motion.div>

            {!loading && products.length === 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900 px-6 py-12 text-center">
                <h2 className="text-lg font-bold text-white">No products found</h2>
                <p className="mt-2 text-sm text-neutral-400">
                  Try a different search term or adjust your filters.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-4 rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-neutral-950 hover:bg-amber-300"
                  >
                    Clear search and filters
                  </button>
                )}
              </div>
            )}

            {/* ── PAGINATION ── */}
            {!loading && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16"
              >
                <div className="text-sm text-neutral-400">
                  Showing{' '}
                  <span className="text-white font-bold">
                    {(pagination.currentPage - 1) * pagination.limit + 1}–
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)}
                  </span>{' '}
                  of <span className="text-white font-bold">{pagination.totalProducts}</span> products
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loading}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all text-sm font-bold ${
                      pagination.currentPage === 1 || loading
                        ? 'bg-white/5 text-neutral-600 cursor-not-allowed'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) pageNum = i + 1;
                      else if (pagination.currentPage <= 3) pageNum = i + 1;
                      else if (pagination.currentPage >= pagination.totalPages - 2)
                        pageNum = pagination.totalPages - 4 + i;
                      else pageNum = pagination.currentPage - 2 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`w-10 h-10 rounded-full transition-all flex items-center justify-center font-bold text-sm ${
                            pagination.currentPage === pageNum
                              ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/30'
                              : 'bg-white/5 hover:bg-white/10 text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {pagination.totalPages > 5 &&
                      pagination.currentPage < pagination.totalPages - 2 && (
                        <>
                          <span className="text-neutral-500 px-1">…</span>
                          <button
                            onClick={() => handlePageChange(pagination.totalPages)}
                            disabled={loading}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm"
                          >
                            {pagination.totalPages}
                          </button>
                        </>
                      )}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages || loading}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all text-sm font-bold ${
                      pagination.currentPage === pagination.totalPages || loading
                        ? 'bg-white/5 text-neutral-600 cursor-not-allowed'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}