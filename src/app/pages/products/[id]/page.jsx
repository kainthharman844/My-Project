'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiStar, FiChevronLeft, FiChevronRight, FiShoppingCart, FiHeart } from 'react-icons/fi';
import Navbar from '@/src/components/Navbar';
import Footer from '../../../../components/footer';
import { use } from 'react';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
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
        } else {
          setError(data.error || 'Failed to fetch product');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleNextImage = () => {
    setActiveImageIndex((prev) => 
      (prev + 1) % product.images.length
    );
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => 
      (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(product.stock, quantity + value));
    setQuantity(newValue);
  };

  const handleAddToCart = () => {
    alert(`${quantity} ${product.name} added to cart`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="bg-gray-200 h-96 rounded-xl"></div>
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-200 h-20 w-20 rounded-md"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-12 bg-gray-200 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md mx-auto text-center shadow-sm">
              <p className="mb-3">{error}</p>
              <button
                onClick={() => router.push('/products')}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow hover:shadow-md"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl max-w-md mx-auto text-center shadow-sm">
              <p className="mb-3">Product not found</p>
              <button
                onClick={() => router.push('/products')}
                className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow hover:shadow-md"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <FiChevronLeft className="mr-1" />
            Back to Products
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={product.images[activeImageIndex]?.url || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                  
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
                        aria-label="Next image"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.publicId}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                        activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-blue-600">
                  ₹{product.price.toFixed(2)}
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {product.brand && (
                      <div>
                        <span className="text-gray-500">Brand:</span>
                        <span className="ml-2 font-medium">{product.brand}</span>
                      </div>
                    )}
                    {product.category && (
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <span className="ml-2 font-medium capitalize">{product.category}</span>
                      </div>
                    )}
                    {product.gender && (
                      <div>
                        <span className="text-gray-500">Gender:</span>
                        <span className="ml-2 font-medium">{product.gender}</span>
                      </div>
                    )}
                    {product.frameType && (
                      <div>
                        <span className="text-gray-500">Frame Type:</span>
                        <span className="ml-2 font-medium">{product.frameType}</span>
                      </div>
                    )}
                    {product.color && (
                      <div>
                        <span className="text-gray-500">Color:</span>
                        <span className="ml-2 font-medium capitalize">{product.color}</span>
                      </div>
                    )}
                    {product.material && (
                      <div>
                        <span className="text-gray-500">Material:</span>
                        <span className="ml-2 font-medium capitalize">{product.material}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Availability:</span>
                      <span className={`ml-2 font-medium ${
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {product.stock > 0 ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-2 bg-white w-12 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600"
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => router.push('/pages/payment-clone')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                      >
                        <FiShoppingCart />
                        <span>Buy Now</span>
                      </button>
                      <button className="p-3 text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
                        <FiHeart className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-600 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.user?.name || 'Anonymous'}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
