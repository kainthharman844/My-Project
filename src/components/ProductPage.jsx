import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          // For now, we'll use the productcard API to get all products and filter
          const response = await fetch('/api/productcard');
          const data = await response.json();
          if (response.ok && data.success) {
            const foundProduct = data.products.find(p => p._id === id);
            if (foundProduct) {
              setProduct(foundProduct);
            } else {
              console.error('Product not found');
            }
          } else {
            console.error(data.error || 'Failed to fetch product');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{product.brand}</p>
            <p className="text-2xl font-bold text-indigo-600 mb-6">${product.price}</p>
            <p className="text-gray-700 mb-6">{product.description || 'No description available'}</p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 