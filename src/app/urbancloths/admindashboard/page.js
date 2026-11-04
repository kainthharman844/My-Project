'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

const initialFormState = {
  name: '',
  category: 'Hoodies',
  price: '',
  stock: '',
  description: '',
  fit: 'Regular',
  sizes: ['S', 'M', 'L'],
  image: '',
};

const categories = ['Hoodies', 'Tees', 'Jackets', 'Joggers', 'Denim', 'Accessories'];
const fits = ['Oversized', 'Regular', 'Slim', 'Boxy', 'Tapered'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(newProduct.image);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile, newProduct.image]);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

    if (!token) {
      router.replace('/admin/login');
      return () => { active = false; };
    }

    const loadProducts = async () => {
      try {
        const response = await fetch('/api/admin/addproduct', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to load products');
        if (active) setProducts(result.products);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Failed to load products');
      } finally {
        if (active) setLoadingProducts(false);
      }
    };

    loadProducts();
    return () => { active = false; };
  }, [router]);

  const closeForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
    setNewProduct(initialFormState);
    setImageFile(null);
    setError('');
    setNotice('');
  };

  const openNewProductForm = () => {
    setSelectedProduct(null);
    setNewProduct(initialFormState);
    setImageFile(null);
    setError('');
    setNotice('');
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setSelectedProduct(product);
    setImageFile(null);
    setNewProduct({
      name: product.name || '',
      category: product.category || categories[0],
      price: String(product.price ?? ''),
      stock: String(product.stock ?? ''),
      description: product.description || '',
      fit: product.fit || 'Regular',
      sizes: product.size || product.sizes || ['S', 'M', 'L'],
      image: product.images?.[0]?.url || product.image || '',
    });
    setError('');
    setShowForm(true);
  };

  const toggleSize = (size) => {
    setNewProduct(current => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter(item => item !== size)
        : [...current.sizes, size],
    }));
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();
    setError('');

    if (newProduct.sizes.length === 0) {
      setError('Select at least one available size.');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      if (!token) {
        router.replace('/admin/login');
        return;
      }

      const isEditing = Boolean(selectedProduct);
      const payload = new FormData();
      payload.set('name', newProduct.name.trim());
      payload.set('category', newProduct.category);
      payload.set('price', newProduct.price);
      payload.set('stock', newProduct.stock);
      payload.set('description', newProduct.description);
      payload.set('fit', newProduct.fit);
      payload.set('sizes', JSON.stringify(newProduct.sizes));
      if (imageFile) payload.set('image', imageFile);
      const response = await fetch('/api/admin/addproduct', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isEditing ? { 'X-Product-Id': selectedProduct._id } : {}),
        },
        body: payload,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save product');

      const product = result.product;
      setProducts(current => isEditing
        ? current.map(item => item._id === product._id ? product : item)
        : [product, ...current]);
      closeForm();
      setNotice(result.warning || '');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      if (!token) {
        router.replace('/admin/login');
        return;
      }

      const response = await fetch(
        `/api/admin/addproduct?id=${encodeURIComponent(productToDelete._id)}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete product');

      setProducts(current => current.filter(product => product._id !== productToDelete._id));
      setProductToDelete(null);
      setNotice(result.warning || '');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    router.replace('/admin/login');
  };

  const filteredProducts = products.filter(product =>
    `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())
  );
  const fieldClass = 'w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20';

  return (
    <main className="min-h-screen pt-25 bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Urban Clothes</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">Product management</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
          >
            Log out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Products</h2>
            <p className="mt-1 text-sm text-neutral-500">Add products and manage your existing catalog.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products"
              value={search}
              onChange={event => setSearch(event.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-amber-500 sm:w-60"
            />
            <button
              type="button"
              onClick={openNewProductForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-neutral-950 hover:bg-amber-300"
            >
              <HiOutlinePlus size={20} aria-hidden="true" />
              Add product
            </button>
          </div>
        </div>

        {error && !showForm && (
          <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
        )}
        {notice && (
          <p role="status" className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{notice}</p>
        )}

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {loadingProducts ? (
            <p className="p-8 text-center text-sm text-neutral-500">Loading products…</p>
          ) : filteredProducts.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold">{search ? 'No matching products found.' : 'No products yet.'}</p>
              {!search && (
                <button type="button" onClick={openNewProductForm} className="mt-3 font-bold text-amber-700 hover:text-amber-800">
                  Add your first product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-neutral-100 text-xs uppercase tracking-wider text-neutral-500">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-bold">Product</th>
                    <th scope="col" className="px-5 py-4 font-bold">Category</th>
                    <th scope="col" className="px-5 py-4 font-bold">Price</th>
                    <th scope="col" className="px-5 py-4 font-bold">Stock</th>
                    <th scope="col" className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.map(product => (
                    <tr key={product._id} className="hover:bg-neutral-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt=""
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-neutral-100" aria-hidden="true" />
                          )}
                          <span className="font-semibold">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{product.category}</td>
                      <td className="px-5 py-4 text-sm font-semibold">₹{product.price}</td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{product.stock}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            aria-label={`Update ${product.name}`}
                            className="rounded-lg p-2 text-neutral-600 hover:bg-amber-100 hover:text-amber-800"
                          >
                            <HiOutlinePencil size={19} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setError('');
                              setProductToDelete(product);
                            }}
                            aria-label={`Delete ${product.name}`}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <HiOutlineTrash size={19} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <h2 id="product-form-title" className="text-xl font-bold">
                {selectedProduct ? 'Update product' : 'Add product'}
              </h2>
              <button type="button" onClick={closeForm} aria-label="Close form" className="rounded-lg p-2 hover:bg-neutral-100">
                <HiOutlineX size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-semibold">
                  Product name
                  <input required maxLength={120} value={newProduct.name} onChange={event => setNewProduct({ ...newProduct, name: event.target.value })} className={fieldClass} />
                </label>
                <label className="space-y-1.5 text-sm font-semibold">
                  Category
                  <select value={newProduct.category} onChange={event => setNewProduct({ ...newProduct, category: event.target.value })} className={fieldClass}>
                    {categories.map(category => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <label className="space-y-1.5 text-sm font-semibold">
                  Price (₹)
                  <input required type="number" min="0.01" step="0.01" value={newProduct.price} onChange={event => setNewProduct({ ...newProduct, price: event.target.value })} className={fieldClass} />
                </label>
                <label className="space-y-1.5 text-sm font-semibold">
                  Stock
                  <input required type="number" min="0" step="1" value={newProduct.stock} onChange={event => setNewProduct({ ...newProduct, stock: event.target.value })} className={fieldClass} />
                </label>
                <label className="space-y-1.5 text-sm font-semibold">
                  Fit
                  <select value={newProduct.fit} onChange={event => setNewProduct({ ...newProduct, fit: event.target.value })} className={fieldClass}>
                    {fits.map(fit => <option key={fit}>{fit}</option>)}
                  </select>
                </label>
                <label className="space-y-1.5 text-sm font-semibold">
                  Product photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={event => {
                      setError('');
                      const file = event.target.files?.[0] || null;
                      if (file && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                        setError('Choose a JPG, PNG, or WebP image.');
                        event.target.value = '';
                        setImageFile(null);
                        return;
                      }
                      if (file && file.size > 10 * 1024 * 1024) {
                        setError('Image must be 10 MB or smaller.');
                        event.target.value = '';
                        setImageFile(null);
                        return;
                      }
                      setImageFile(file);
                    }}
                    className={fieldClass}
                  />
                  <span className="block text-xs font-normal text-neutral-500">
                    JPG, PNG, or WebP; maximum 10 MB. Uploaded securely to Cloudinary.
                  </span>
                </label>
              </div>

              {imagePreview && (
                <div className="flex items-center gap-3">
                  <img src={imagePreview} alt="Product photo preview" className="h-16 w-16 rounded-lg object-cover" />
                  <span className="text-sm text-neutral-500">{imageFile?.name || 'Current product photo'}</span>
                </div>
              )}

              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Available sizes</legend>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={newProduct.sizes.includes(size)}
                      onClick={() => toggleSize(size)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                        newProduct.sizes.includes(size)
                          ? 'border-amber-400 bg-amber-400 text-neutral-950'
                          : 'border-neutral-300 text-neutral-600 hover:border-amber-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block space-y-1.5 text-sm font-semibold">
                Description (optional)
                <textarea rows={3} value={newProduct.description} onChange={event => setNewProduct({ ...newProduct, description: event.target.value })} className={`${fieldClass} resize-y`} />
              </label>

              {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

              <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
                <button type="button" onClick={closeForm} className="rounded-xl px-5 py-3 font-semibold text-neutral-600 hover:bg-neutral-100">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-neutral-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? 'Saving…' : selectedProduct ? 'Update product' : 'Add product'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="delete-title" className="text-lg font-bold">Delete this product?</h2>
            <p className="mt-2 text-sm text-neutral-600">
              <span className="font-semibold">{productToDelete.name}</span> will be permanently removed.
            </p>
            {error && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={deleting} onClick={() => setProductToDelete(null)} className="rounded-xl px-4 py-2.5 font-semibold text-neutral-600 hover:bg-neutral-100">
                Cancel
              </button>
              <button type="button" disabled={deleting} onClick={handleDeleteProduct} className="rounded-xl bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete product'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
