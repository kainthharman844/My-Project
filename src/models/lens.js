import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Accessories'],
    required: true,
  },
  brand: {
    type: String,
  },
  images: [
    {
      url: {
        type: String, 
        required: true,
      },
      publicId: {
        type: String, 
        required: true,
      },
    },
  ], 
  stock: {
    type: Number,
    default: 0,
  },
  frameType: {
    type: String,
    enum: ['Full Rim', 'Half Rim', 'Rimless'],
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
  },
  color: {
    type: String,
  },
  material: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      rating: {
        type: Number,
        min: 1,
        max: 4,
        required: true,
      },
    },
  ],
  numReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);