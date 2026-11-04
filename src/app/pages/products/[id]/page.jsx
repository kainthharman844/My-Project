'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiStar, FiChevronLeft, FiChevronRight, FiShoppingCart, FiHeart, FiCheck } from 'react-icons/fi';
import Navbar from '@/src/components/Navbar';
import Footer from '../../../../components/footer';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product-details/${id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
          setError(null);
          // Auto-select first available size if it exists
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
        } else {
          setError(data.error || 'Failed to fetch product');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(product.stock, quantity + value));
    setQuantity(newValue);
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    alert(`${quantity} x ${product.name} (Size: ${selectedSize || 'N/A'}) added to cart`);
  };

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen bg-neutral-950 text-white pt-[100px] pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse bg-neutral-900 rounded-3xl border border-white/5 p-6 sm:p-10 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="bg-neutral-800 h-[500px] rounded-2xl"></div>
                  <div className="flex gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-neutral-800 h-24 w-24 rounded-xl"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6 pt-4">
                  <div className="h-10 bg-neutral-800 rounded-lg w-3/4"></div>
                  <div className="h-6 bg-neutral-800 rounded-lg w-1/2"></div>
                  <div className="h-8 bg-neutral-800 rounded-lg w-1/4 mt-4"></div>
                  <div className="h-4 bg-neutral-800 rounded-lg w-full"></div>
                  <div className="h-4 bg-neutral-800 rounded-lg w-5/6"></div>
                  <div className="h-14 bg-neutral-800 rounded-xl w-full mt-8"></div>
                  <div className="h-14 bg-neutral-800 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-8 py-6 rounded-3xl max-w-md mx-auto text-center shadow-2xl">
            <p className="mb-4 font-medium">{error}</p>
            <button
              onClick={() => router.push('/pages/products-page')}
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-6 rounded-full text-sm transition-colors w-full"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
          <div className="bg-amber-400/10 border border-amber-400/30 text-amber-300 px-8 py-6 rounded-3xl max-w-md mx-auto text-center shadow-2xl">
            <p className="mb-4 font-medium">Product not found</p>
            <button
              onClick={() => router.push('/pages/products-page')}
              className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold py-3 px-6 rounded-full text-sm transition-colors w-full"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="min-h-screen bg-neutral-950 text-white pt-[100px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-neutral-400 hover:text-amber-400 font-medium mb-8 transition-colors group"
          >
            <FiChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </button>

          <div className="bg-neutral-900 rounded-3xl border border-white/5 p-6 sm:p-10 max-w-6xl mx-auto shadow-2xl">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-neutral-800 rounded-2xl overflow-hidden group">
                  <Image
                    src={product.images[activeImageIndex]?.url || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {product.images?.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-neutral-950/70 hover:bg-amber-400 hover:text-neutral-950 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-neutral-950/70 hover:bg-amber-400 hover:text-neutral-950 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                        aria-label="Next image"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnails */}
                {product.images?.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((image, index) => (
                      <button
                        key={image.publicId || index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImageIndex === index ? 'border-amber-400' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-white/5 text-neutral-300 rounded-full font-bold">
                      {product.category}
                    </span>
                    {product.brand && (
                      <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-amber-400/10 text-amber-300 rounded-full font-bold">
                        {product.brand}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center mt-4">
                    <div className="flex items-center mr-3">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-400 font-medium">
                      ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>

                <div className="text-3xl font-black text-amber-400 mt-6">
                  ₹{Number(product.price).toFixed(0)}
                </div>

                <div className="mt-6 space-y-6">
                  <p className="text-neutral-400 leading-relaxed">
                    {product.description || "No description available for this product."}
                  </p>
                  
                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm bg-neutral-950/50 p-5 rounded-2xl border border-white/5">
                    {product.fit && (
                      <div>
                        <span className="text-neutral-500 block text-[11px] uppercase tracking-wider font-bold">Fit</span>
                        <span className="font-semibold text-white mt-0.5 block">{product.fit}</span>
                      </div>
                    )}
                    {product.gender && (
                      <div>
                        <span className="text-neutral-500 block text-[11px] uppercase tracking-wider font-bold">Gender</span>
                        <span className="font-semibold text-white mt-0.5 block">{product.gender}</span>
                      </div>
                    )}
                    {product.color && (
                      <div>
                        <span className="text-neutral-500 block text-[11px] uppercase tracking-wider font-bold">Color</span>
                        <span className="font-semibold text-white mt-0.5 block capitalize">{product.color}</span>
                      </div>
                    )}
                    {product.material && (
                      <div>
                        <span className="text-neutral-500 block text-[11px] uppercase tracking-wider font-bold">Material</span>
                        <span className="font-semibold text-white mt-0.5 block capitalize">{product.material}</span>
                      </div>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Availability:</span>
                    <span className={`font-bold flex items-center gap-1.5 ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.stock > 0 ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          In Stock ({product.stock} left)
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          Out of Stock
                        </>
                      )}
                    </span>
                  </div>

                  {/* Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Select Size</span>
                        <button className="text-xs text-neutral-400 hover:text-amber-400 underline transition-colors">Size Guide</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                          if (!product.sizes.includes(size)) return null;
                          return (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all border ${
                                selectedSize === size
                                  ? 'bg-amber-400 border-amber-400 text-neutral-950'
                                  : 'bg-neutral-950 border-white/10 text-white hover:border-amber-400/50'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Add to Cart Actions */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  {product.stock > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Quantity */}
                      <div className="flex items-center bg-neutral-950 border border-white/10 rounded-xl overflow-hidden h-14 w-full sm:w-auto">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="px-4 h-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 font-bold text-white w-12 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="px-4 h-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>

                      {/* Buttons */}
                      <div className="flex-1 flex gap-3 w-full">
                        <button
                          onClick={() => router.push('/pages/payment-clone')}
                          className="flex-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm tracking-wide h-14 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-amber-400/20"
                        >
                          <FiShoppingCart className="w-5 h-5" />
                          <span>Buy Now</span>
                        </button>
                        <button 
                          onClick={handleAddToCart}
                          className="h-14 px-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-colors flex items-center justify-center group"
                          aria-label="Add to Wishlist"
                        >
                          <FiHeart className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-white/5 text-neutral-500 py-4 rounded-xl font-bold text-sm tracking-wide cursor-not-allowed border border-white/5"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 bg-neutral-900 rounded-3xl border border-white/5 p-6 sm:p-10 max-w-6xl mx-auto">
            <h2 className="text-2xl font-black tracking-tight text-white mb-8">Customer Reviews</h2>
            
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-3">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-neutral-300">
                        {review.user?.name || 'Anonymous'}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed">{review.comment || "Great product!"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-neutral-950 rounded-2xl border border-white/5">
                <p className="text-neutral-400">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </>
  );
}