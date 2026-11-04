"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CldUploadWidget } from 'next-cloudinary';
import React from 'react';

export default function AddProduct() {
  const router = useRouter();
  const motionDivRef = React.useRef(null);
  const formRef = React.useRef(null);
  const isInView = useInView(motionDivRef, { once: false, amount: 0.1 });
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Eyeglasses',
    brand: '',
    images: [],
    stock: 0,
    frameType: 'Full Rim',
    gender: 'Unisex',
    color: '',
    material: '',
    reviews: [],
    numReviews: 0,
    rating: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [newReviewRating, setNewReviewRating] = useState(1);

  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const fieldFocus = {
    focus: {
      scale: 1.01,
      transition: { duration: 0.1 },
    },
  };

  const dropZone = {
    idle: { borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
    dragging: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleImageUpload = (result) => {
    if (result.event === 'success') {
      const { secure_url, public_id } = result.info;
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { url: secure_url, publicId: public_id }],
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddReview = () => {
    if (newReviewRating >= 1 && newReviewRating <= 4) {
      setFormData((prev) => ({
        ...prev,
        reviews: [...prev.reviews, { rating: newReviewRating }],
        numReviews: prev.reviews.length + 1,
        rating: prev.reviews.length
          ? (
              (prev.rating * prev.reviews.length + newReviewRating) /
              (prev.reviews.length + 1)
            ).toFixed(1)
          : newReviewRating,
      }));
      setNewReviewRating(1);
    } else {
      setError('Review rating must be between Hawkins between 1 and 4');
    }
  };

  const handleRemoveReview = (index) => {
    setFormData((prev) => {
      const newReviews = prev.reviews.filter((_, i) => i !== index);
      const newNumReviews = newReviews.length;
      const newRating =
        newReviews.length > 0
          ? (
              newReviews.reduce((sum, review) => sum + review.rating, 0) /
              newReviews.length
            ).toFixed(1)
          : 0;
      return {
        ...prev,
        reviews: newReviews,
        numReviews: newNumReviews,
        rating: newRating,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images' || key === 'reviews') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      const response = await fetch('/api/admin/addproduct', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      setSuccess('Product added successfully!');
      setTimeout(() => router.push('/prabjot'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-black mb-2">
            Add New Product
          </h1>
          <p className="text-black max-w-2xl mx-auto">
            Fill out the form to expand your eyewear collection
          </p>
        </motion.div>

        {/* Status messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-black rounded"
            >
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-black rounded"
            >
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {success}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main form */}
        <motion.div
          ref={motionDivRef}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
              {/* Product Name */}
              <motion.div
                variants={item}
                className="sm:col-span-6"
                onFocus={() => setActiveField('name')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Product Name *
                </label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variants={fieldFocus}
                  animate={activeField === 'name' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                  required
                />
              </motion.div>

              {/* Description */}
              <motion.div
                variants={item}
                className="sm:col-span-6"
                onFocus={() => setActiveField('description')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Description
                </label>
                <motion.textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  variants={fieldFocus}
                  animate={activeField === 'description' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                />
              </motion.div>

              {/* Price */}
              <motion.div
                variants={item}
                className="sm:col-span-2"
                onFocus={() => setActiveField('price')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Price (₹) *
                </label>
                <motion.div
                  variants={fieldFocus}
                  animate={activeField === 'price' ? 'focus' : ''}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-black">₹</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={handleNumberChange}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                    required
                  />
                </motion.div>
              </motion.div>

              {/* Stock */}
              <motion.div
                variants={item}
                className="sm:col-span-2"
                onFocus={() => setActiveField('stock')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Stock Quantity
                </label>
                <motion.input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleNumberChange}
                  variants={fieldFocus}
                  animate={activeField === 'stock' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                />
              </motion.div>

              {/* Category */}
              <motion.div
                variants={item}
                className="sm:col-span-2"
                onFocus={() => setActiveField('category')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Category *
                </label>
                <motion.select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  variants={fieldFocus}
                  animate={activeField === 'category' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] text-black"
                  required
                >
                  <option value="Eyeglasses">Eyeglasses</option>
                  <option value="Sunglasses">Sunglasses</option>
                  <option value="Contact Lenses">Contact Lenses</option>
                  <option value="Accessories">Accessories</option>
                </motion.select>
              </motion.div>

              {/* Brand */}
              <motion.div
                variants={item}
                className="sm:col-span-3"
                onFocus={() => setActiveField('brand')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Brand
                </label>
                <motion.input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  variants={fieldFocus}
                  animate={activeField === 'brand' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                />
              </motion.div>

              {/* Frame Type */}
              <motion.div
                variants={item}
                className="sm:col-span-3"
                onFocus={() => setActiveField('frameType')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Frame Type
                </label>
                <motion.select
                  name="frameType"
                  value={formData.frameType}
                  onChange={handleChange}
                  variants={fieldFocus}
                  animate={activeField === 'frameType' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] text-black"
                >
                  <option value="Full Rim">Full Rim</option>
                  <option value="Half Rim">Half Rim</option>
                  <option value="Rimless">Rimless</option>
                </motion.select>
              </motion.div>

              {/* Gender */}
              <motion.div
                variants={item}
                className="sm:col-span-2"
                onFocus={() => setActiveField('gender')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Gender
                </label>
                <motion.select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  variants={fieldFocus}
                  animate={activeField === 'gender' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] text-black"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </motion.select>
              </motion.div>

              {/* Color */}
              <motion.div
                variants={item}
                className="sm:col-span-2"
                onFocus={() => setActiveField('color')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Color
                </label>
                <motion.input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  variants={fieldFocus}
                  animate={activeField === 'color' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                />
              </motion.div>

              {/* Material */}
              <motion.div
                variants={item}
                className="sm:col-span-2"
                onFocus={() => setActiveField('material')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-black mb-1">
                  Material
                </label>
                <motion.input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  variants={fieldFocus}
                  animate={activeField === 'material' ? 'focus' : ''}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                />
              </motion.div>

              {/* Reviews */}
              <motion.div variants={item} className="sm:col-span-6">
                <label className="block text-sm font-medium text-black mb-1">
                  Reviews
                </label>
                <div className="flex space-x-4 mb-4">
                  <motion.select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    variants={fieldFocus}
                    animate={activeField === 'reviewRating' ? 'focus' : ''}
                    className="w-32 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                    onFocus={() => setActiveField('reviewRating')}
                    onBlur={() => setActiveField(null)}
                  >
                    {[1, 2, 3, 4].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating > 1 ? 's' : ''}
                      </option>
                    ))}
                  </motion.select>
                  <motion.button
                    type="button"
                    onClick={handleAddReview}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
                  >
                    Add Review
                  </motion.button>
                </div>
                {formData.reviews.length > 0 && (
                  <motion.div variants={item} className="mt-4">
                    <p className="text-sm text-black mb-2">
                      Average Rating: {formData.rating} ({formData.numReviews}{' '}
                      {formData.numReviews === 1 ? 'Review' : 'Reviews'})
                    </p>
                    <div className="space-y-2">
                      {formData.reviews.map((review, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <span className="text-black">
                            {review.rating} Star{review.rating > 1 ? 's' : ''}
                          </span>
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveReview(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-red-500 text-white rounded-full p-1.5"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Image Upload */}
              <motion.div variants={item} className="sm:col-span-6">
                <label className="block text-sm font-medium text-black mb-1">
                  Product Images
                </label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  options={{
                    multiple: true,
                    folder: 'products',
                    maxFiles: 5,
                    resourceType: 'image',
                    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'svg'],
                    maxFileSize: 10000000, // 10MB
                  }}
                  onSuccess={handleImageUpload}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={() => setIsDragging(false)}
                >
                  {({ open }) => (
                    <motion.div
                      variants={dropZone}
                      animate={isDragging ? 'dragging' : 'idle'}
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all"
                      onClick={() => open()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        open();
                      }}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-black">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-black mt-1">
                            SVG, PNG, JPG, or GIF (max. 10MB, up to 5 images)
                          </p>
                          {isDragging && (
                            <p className="text-xs text-blue-600 mt-1">
                              Drop images here
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CldUploadWidget>
                {formData.images.length > 0 && (
                  <motion.div
                    variants={item}
                    className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3"
                  >
                    {formData.images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <img
                          src={image.url}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-28 object-cover rounded-md"
                        />
                        <motion.button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Form actions */}
            <motion.div
              variants={item}
              className="mt-8 flex justify-end space-x-3"
            >
              <motion.button
                type="button"
                onClick={() => router.push('/admin/products')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-black border border-gray-300 bg-white hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Product
                  </span>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}