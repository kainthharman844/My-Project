import nextEnv from '@next/env';
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';

nextEnv.loadEnvConfig(process.cwd());

const demoBrand = 'UrbanClothes Demo';
const categories = [
  {
    name: 'Hoodies',
    products: [
      'Urban Core Pullover Hoodie',
      'Oversized Graphic Hoodie',
      'Heavyweight Fleece Hoodie',
      'Minimal Logo Zip Hoodie',
      'Colorblock Street Hoodie',
      'Washed Cotton Hoodie',
      'Everyday Relaxed Hoodie',
      'Utility Pocket Hoodie',
      'Varsity Print Hoodie',
    ],
  },
  {
    name: 'Tees',
    products: [
      'Essential Cotton Tee',
      'Graphic Streetwear Tee',
      'Boxy Fit Logo Tee',
      'Vintage Wash Tee',
      'Heavyweight Crew Tee',
      'Abstract Print Tee',
      'Relaxed Pocket Tee',
      'Contrast Stitch Tee',
      'Monochrome Oversized Tee',
    ],
  },
  {
    name: 'Jackets',
    products: [
      'Utility Cargo Jacket',
      'Denim Trucker Jacket',
      'Lightweight Windbreaker',
      'Varsity Bomber Jacket',
      'Quilted Coach Jacket',
      'Washed Canvas Jacket',
      'Colorblock Track Jacket',
      'Minimal Zip Jacket',
    ],
  },
  {
    name: 'Joggers',
    products: [
      'Tapered Fleece Joggers',
      'Utility Cargo Joggers',
      'Everyday Lounge Joggers',
      'Washed Cotton Joggers',
      'Relaxed Fit Track Pants',
      'Cuffed Street Joggers',
      'Techwear Joggers',
      'Classic Straight Joggers',
    ],
  },
  {
    name: 'Denim',
    products: [
      'Relaxed Straight Jeans',
      'Washed Blue Denim',
      'Tapered Black Jeans',
      'Utility Denim Pants',
      'Vintage Light-Wash Jeans',
      'Wide-Leg Street Denim',
      'Classic Indigo Jeans',
      'Distressed Denim Pants',
    ],
  },
  {
    name: 'Accessories',
    products: [
      'Everyday Canvas Cap',
      'Ribbed Knit Beanie',
      'Urban Crossbody Bag',
      'Classic Street Belt',
      'Crew Socks Three-Pack',
      'Minimalist Tote Bag',
      'Logo Bucket Hat',
      'Utility Shoulder Pouch',
    ],
  },
];

const imageUrls = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=900&q=80',
];

const sizeOptions = [
  ['S', 'M', 'L', 'XL'],
  ['XS', 'S', 'M', 'L'],
  ['M', 'L', 'XL', 'XXL'],
  ['One Size'],
];
const fits = ['Oversized', 'Regular', 'Slim', 'Boxy', 'Tapered'];
const products = categories.flatMap(category =>
  category.products.map(name => ({ name, category: category.name }))
);

if (products.length !== 50) {
  throw new Error(`Expected 50 demo products, found ${products.length}.`);
}

for (const [key, value] of Object.entries({
  MONGO_URI: process.env.MONGO_URI,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
})) {
  if (!value) throw new Error(`${key} is not configured.`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const client = new MongoClient(process.env.MONGO_URI);

try {
  await client.connect();
  const collection = client.db().collection('products');
  const existingDemoCount = await collection.countDocuments({ brand: demoBrand });
  console.log(`Seeding ${products.length} demo products (${existingDemoCount} already exist; records will be updated).`);

  const operations = [];
  for (const [index, product] of products.entries()) {
    const assetName = `product-${String(index + 1).padStart(2, '0')}`;
    const image = await cloudinary.uploader.upload(imageUrls[index % imageUrls.length], {
      folder: 'urbanclothes/demo-products',
      public_id: assetName,
      overwrite: true,
      resource_type: 'image',
    });

    const document = {
      ...product,
      brand: demoBrand,
      description: `Demo ${product.category.toLowerCase()} piece with an everyday streetwear fit.`,
      price: 699 + (index % 32) * 100,
      stock: 12 + (index * 7) % 89,
      size: sizeOptions[index % sizeOptions.length],
      fit: fits[index % fits.length],
      images: [{ url: image.secure_url, publicId: image.public_id }],
      rating: 0,
      reviews: [],
      numReviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    operations.push({
      updateOne: {
        filter: { brand: demoBrand, name: product.name },
        update: { $set: document },
        upsert: true,
      },
    });
    console.log(`Uploaded photo ${index + 1}/${products.length}`);
  }

  const result = await collection.bulkWrite(operations, { ordered: true });
  const totalDemoProducts = await collection.countDocuments({ brand: demoBrand });
  console.log(
    `Done: ${totalDemoProducts} demo products in MongoDB ` +
    `(${result.upsertedCount} added, ${result.modifiedCount} updated); photos stored in Cloudinary.`
  );
} catch (error) {
  console.error('Failed to seed demo products:', error.message || error);
  process.exitCode = 1;
} finally {
  await client.close();
}
