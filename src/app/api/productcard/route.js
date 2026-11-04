import Product from '../../../models/lens';
import connectDB from '../../../lib/dbcollection';

const categories = ['Hoodies', 'Tees', 'Jackets', 'Joggers', 'Denim', 'Accessories'];
const genders = ['Men', 'Women', 'Unisex'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10);
    const requestedLimit = Number.parseInt(searchParams.get('limit') || '8', 10);
    if (!Number.isInteger(requestedPage) || requestedPage < 1 ||
      !Number.isInteger(requestedLimit) || requestedLimit < 1) {
      return Response.json({ success: false, error: 'Page and limit must be positive integers' }, { status: 400 });
    }

    const category = searchParams.get('category')?.trim() || '';
    const gender = searchParams.get('gender')?.trim() || '';
    const size = searchParams.get('size')?.trim() || '';
    const search = searchParams.get('search')?.trim() || '';
    if ((category && !categories.includes(category)) ||
      (gender && !genders.includes(gender)) ||
      (size && !sizes.includes(size)) ||
      search.length > 100) {
      return Response.json({ success: false, error: 'One or more product filters are invalid' }, { status: 400 });
    }

    const filter = {};
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (size) filter.size = size;
    if (search) {
      const searchPattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = ['name', 'category', 'brand', 'description', 'color', 'fit']
        .map(field => ({ [field]: searchPattern }));
    }

    const totalProducts = await Product.countDocuments(filter);
    const limit = Math.min(requestedLimit, 50);
    const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
    const page = Math.min(requestedPage, totalPages);
    const products = await Product.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name price images category brand rating numReviews')
      .lean();

    return Response.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch products',
    }, { status: 500 });
  }
}