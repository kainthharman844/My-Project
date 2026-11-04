"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HomePage = () => {
  const router = useRouter();

  // Manually added products data
  const products = [
    {
      _id: '1',
      name: 'Classic Aviator',
      brand: 'Ray-Ban',
      price: 149.99,
      images: ['/number1.png'], 
      description: 'Timeless aviator style with UV protection lenses'
    },
    {
      _id: '2',
      name: 'Modern Round',
      brand: 'Warby Parker',
      price: 129.99,
      images: ['/number2.png'],
      description: 'Contemporary round frames with lightweight design'
    },
    {
      _id: '3',
      name: 'Bold Square',
      brand: 'Oakley',
      price: 179.99,
      images: ['/number3.png'],
      description: 'Durable square frames with impact-resistant lenses'
    },
    {
      _id: '4',
      name: 'Vintage Cat-Eye',
      brand: 'Persol',
      price: 199.99,
      images: ['/number4.png'],
      description: 'Retro-inspired cat-eye frames with premium acetate'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section - Updated layout */}
      <div className="relative bg-gray-900 w-full">
        {/* Text content with backdrop blur */}
        <div className="relative z-10 w-full bg-gray-900/80 backdrop-blur-sm py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
              >
                <span className="block">Elevate Your Vision</span>
                <span className="block text-indigo-400">With Style</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
              >
                Discover our premium collection of stylish and comfortable eyewear for every occasion. Perfect vision meets perfect style.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex justify-center"
              >

              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Hero image - full width */}
        <div className="absolute inset-0 w-full h-auto">
          <Image
            src="/HeroPicture.png"
            alt="Stylish eyewear collection"
            fill
            className="object-cover opacity-80"
            priority
            quality={100}
          />
        </div>
      </div>

      {/* Featured Products - Improved card layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Featured Collection
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our most popular designs this season
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
              >
                <div className="aspect-square w-full relative bg-gray-100">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    <button 
                      onClick={() => router.push(`/product?id=${product._id}`)}
                      className="focus:outline-none"
                    >
                      {product.name}
                    </button>
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('pages/products-page')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
            >
              View Full Collection
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 -mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Premium Eyewear Experience
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We combine style, comfort, and quality to give you the perfect vision solution.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Premium Materials',
                  description: 'Our frames are crafted from high-quality acetate and durable metals for long-lasting wear.',
                  icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                },
                {
                  name: 'UV Protection',
                  description: 'All our lenses come with 100% UV protection to safeguard your eyes from harmful rays.',
                  icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
                },
                {
                  name: 'Free Shipping',
                  description: 'Enjoy free shipping on all orders over $50 with our fast and reliable delivery service.',
                  icon: 'M3 3a1 1 0 000 2h18a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z'
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="pt-6"
                >
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;