import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '../../../../lib/dbcollection';
import Product from '../../../../models/lens';

const categories = ['Hoodies', 'Tees', 'Jackets', 'Joggers', 'Denim', 'Accessories'];
const fits = ['Oversized', 'Regular', 'Slim', 'Boxy', 'Tapered'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const maxImageSize = 10 * 1024 * 1024;
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

class ProductRequestError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function authorize(request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return NextResponse.json({ error: 'You must be signed in as an admin' }, { status: 401 });
  }
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return NextResponse.json({ error: 'Admin authentication is unavailable' }, { status: 500 });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return null;
  } catch {
    return NextResponse.json({ error: 'Your admin session is invalid or expired' }, { status: 401 });
  }
}

function validateProduct(input) {
  const name = String(input.name || '').trim();
  const category = String(input.category || '');
  const fit = String(input.fit || '');
  const price = Number(input.price);
  const stock = Number(input.stock);
  const productSizes = input.sizes ?? input.size ?? [];

  if (!name || name.length > 120 || !categories.includes(category) ||
    input.price === '' || !Number.isFinite(price) || price <= 0 ||
    input.stock === '' || !Number.isInteger(stock) || stock < 0) {
    return { error: 'Enter a name, category, valid price, and non-negative whole-number stock' };
  }
  if (fit && !fits.includes(fit)) {
    return { error: `Fit must be one of: ${fits.join(', ')}` };
  }
  if (!Array.isArray(productSizes) || productSizes.length === 0 ||
    productSizes.some(size => !sizes.includes(size))) {
    return { error: `Select sizes from: ${sizes.join(', ')}` };
  }
  return {
    value: {
      name,
      category,
      price,
      stock,
      description: String(input.description || '').trim(),
      fit,
      size: productSizes,
    },
  };
}

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new ProductRequestError(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      503
    );
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

async function uploadProductImage(file) {
  if (!file || file.size === 0) return null;
  if (!allowedImageTypes.has(file.type)) {
    throw new ProductRequestError('Choose a JPG, PNG, or WebP image.');
  }
  if (file.size > maxImageSize) {
    throw new ProductRequestError('Image must be 10 MB or smaller.');
  }

  configureCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'urbanclothes/products', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(new ProductRequestError('Cloudinary image upload failed.', 502));
        if (!result?.secure_url || !result.public_id) {
          return reject(new ProductRequestError('Cloudinary did not return the uploaded image.', 502));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

async function deleteProductImage(publicId) {
  if (!publicId) return true;
  configureCloudinary();
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  return result.result === 'ok' || result.result === 'not found';
}

async function readProductInput(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    throw new ProductRequestError('Product form data is invalid.');
  }
  let productSizes;
  try {
    productSizes = JSON.parse(formData.get('sizes') || '[]');
  } catch {
    throw new ProductRequestError('Product sizes are malformed.');
  }
  const image = formData.get('image');
  if (image && !(image instanceof File)) {
    throw new ProductRequestError('Product photo must be an uploaded image file.');
  }
  return {
    input: {
      name: formData.get('name'),
      category: formData.get('category'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      description: formData.get('description'),
      fit: formData.get('fit'),
      sizes: productSizes,
    },
    image: image instanceof File && image.size > 0 ? image : null,
  };
}

export async function GET(request) {
  const authError = authorize(request);
  if (authError) return authError;

  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error loading admin products:', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = authorize(request);
  if (authError) return authError;

  let uploadedImage;
  try {
    const { input, image } = await readProductInput(request);
    const validated = validateProduct(input);
    if (validated.error) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    await connectDB();
    uploadedImage = await uploadProductImage(image);
    const product = await Product.create({
      ...validated.value,
      images: uploadedImage ? [uploadedImage] : [],
    });
    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });
  } catch (error) {
    if (uploadedImage?.publicId) {
      try {
        await deleteProductImage(uploadedImage.publicId);
      } catch (cleanupError) {
        console.error('Failed to clean up uploaded product image:', cleanupError);
      }
    }
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof ProductRequestError ? error.message : 'Failed to create product' },
      { status: error instanceof ProductRequestError ? error.status : 500 }
    );
  }
}

export async function PUT(request) {
  const authError = authorize(request);
  if (authError) return authError;

  let uploadedImage;
  try {
    const { input, image } = await readProductInput(request);
    const id = request.headers.get('x-product-id');
    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

    const validated = validateProduct(input);
    if (validated.error) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    await connectDB();
    const existingProduct = await Product.findById(id);
    if (!existingProduct) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    uploadedImage = await uploadProductImage(image);
    const updatedValues = {
      ...validated.value,
      images: uploadedImage ? [uploadedImage] : existingProduct.images,
    };
    const product = await Product.findByIdAndUpdate(id, updatedValues, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      if (uploadedImage?.publicId) await deleteProductImage(uploadedImage.publicId);
      uploadedImage = null;
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let warning;
    const oldPublicId = existingProduct.images?.[0]?.publicId;
    if (uploadedImage && oldPublicId) {
      try {
        if (!await deleteProductImage(oldPublicId)) warning = 'The previous Cloudinary image could not be removed.';
      } catch (cleanupError) {
        console.error('Failed to remove replaced product image:', cleanupError);
        warning = 'The previous Cloudinary image could not be removed.';
      }
    }
    return NextResponse.json({ message: 'Product updated successfully', product, warning });
  } catch (error) {
    if (uploadedImage?.publicId) {
      try {
        await deleteProductImage(uploadedImage.publicId);
      } catch (cleanupError) {
        console.error('Failed to clean up uploaded product image:', cleanupError);
      }
    }
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error instanceof ProductRequestError ? error.message : 'Failed to update product' },
      { status: error instanceof ProductRequestError ? error.status : 500 }
    );
  }
}

export async function DELETE(request) {
  const authError = authorize(request);
  if (authError) return authError;

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    let warning;
    const publicId = product.images?.[0]?.publicId;
    if (publicId) {
      try {
        if (!await deleteProductImage(publicId)) warning = 'The product was deleted, but its Cloudinary image could not be removed.';
      } catch (cleanupError) {
        console.error('Failed to remove deleted product image:', cleanupError);
        warning = 'The product was deleted, but its Cloudinary image could not be removed.';
      }
    }
    return NextResponse.json({ message: 'Product deleted successfully', warning });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
