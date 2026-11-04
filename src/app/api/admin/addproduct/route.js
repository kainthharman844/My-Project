import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import Product from '../../../../models/lens'; 
import connectDB from "../../../../lib/dbcollection";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// API Route Handler for POST /api/products
export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const category = formData.get('category');
    const brand = formData.get('brand');
    const stock = parseInt(formData.get('stock')) || 0;
    const frameType = formData.get('frameType');
    const gender = formData.get('gender');
    const color = formData.get('color');
    const material = formData.get('material');
    const images = JSON.parse(formData.get('images') || '[]');

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    // Validate enum fields
    const validCategories = ['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Accessories'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Category must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    const validFrameTypes = ['Full Rim', 'Half Rim', 'Rimless'];
    if (frameType && !validFrameTypes.includes(frameType)) {
      return NextResponse.json(
        { error: `Frame type must be one of: ${validFrameTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const validGenders = ['Men', 'Women', 'Unisex'];
    if (gender && !validGenders.includes(gender)) {
      return NextResponse.json(
        { error: `Gender must be one of: ${validGenders.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate images array
    if (images.length > 0) {
      for (const image of images) {
        if (!image.url || !image.publicId) {
          return NextResponse.json(
            { error: 'Each image must have a url and publicId' },
            { status: 400 }
          );
        }
      }
    }

    // Create product
    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      images,
      stock,
      frameType,
      gender,
      color,
      material,
      rating: 0,
      numReviews: 0,
      reviews: [],
    });

    await product.save();

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}