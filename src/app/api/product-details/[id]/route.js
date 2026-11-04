'ise client'

import Product from '../../../../models/lens';
import dbConnect from '../../../../lib/dbcollection';

export async function GET(request, { params }) {
  const { id } = params;

  await dbConnect();

  try {
    const product = await Product.findById(id);
    
    if (!product) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Product not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      product 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}