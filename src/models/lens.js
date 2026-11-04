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
    enum: ['Hoodies', 'Tees', 'Jackets', 'Joggers', 'Denim', 'Accessories'],
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
      },
    },
  ], 
  stock: {
    type: Number,
    default: 0,
  },
  size: {
    type: [String],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
    default: ['S', 'M', 'L', 'XL'], // Default sizes if not specified
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
    // Optional: You can enum this too if you want strict control
    // enum: ['Cotton', 'Polyester Blend', 'Denim', 'Fleece', 'Nylon']
  },
  fit: {
    type: String,
    enum: ['Oversized', 'Regular', 'Slim', 'Boxy', 'Tapered'],
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
        max: 5, // Changed max to 5 since it was previously a bug (was set to 4)
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