import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Upload, Package, DollarSign, Tag, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  salePrice: number | null;
  description: string;
  fitment: string;
  category: string;
  image: string;
}

interface MarqueeImage {
  id: number;
  image_url: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  created_at: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [marqueeImages, setMarqueeImages] = useState<MarqueeImage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'marquee' | 'blog'>('products');

  useEffect(() => {
    if (user?.isAdmin) {
      fetchProducts();
      fetchMarqueeImages();
      fetchBlogPosts();
    }
  }, [user]);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Access Denied</h1>
          <p className="text-muted text-sm font-medium uppercase tracking-widest mb-10">
            You do not have administrative privileges to view this page.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-3 px-10">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchMarqueeImages = async () => {
    const res = await fetch('/api/marquee');
    const data = await res.json();
    setMarqueeImages(data);
  };

  const fetchBlogPosts = async () => {
    const res = await fetch('/api/blogs');
    const data = await res.json();
    setBlogPosts(data);
  };

  // --- Marquee Logic ---
  const handleMarqueeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const data = new FormData();
    data.append('imageFile', file);

    try {
      const res = await fetch('/api/marquee', {
        method: 'POST',
        body: data,
        headers: { 'x-admin-access': 'true' }
      });
      if (res.ok) fetchMarqueeImages();
    } catch (error) {
      console.error('Error uploading marquee image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMarquee = async (id: number) => {
    if (!confirm('Delete this marquee image?')) return;
    await fetch(`/api/marquee/${id}`, { 
      method: 'DELETE',
      headers: { 'x-admin-access': 'true' }
    });
    fetchMarqueeImages();
  };

  // --- Blog Logic ---
  const handleEditBlog = (post: BlogPost) => {
    setIsEditing(post.id);
    setBlogFormData(post);
    setIsAdding(false);
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Delete this blog post?')) return;
    await fetch(`/api/blogs/${id}`, { 
      method: 'DELETE',
      headers: { 'x-admin-access': 'true' }
    });
    fetchBlogPosts();
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(blogFormData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    });
    if (imageFile) {
      data.append('imageFile', imageFile);
    }

    const url = isEditing ? `/api/blogs/${isEditing}` : '/api/blogs';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: data,
        headers: { 'x-admin-access': 'true' }
      });
      if (res.ok) {
        setIsEditing(null);
        setIsAdding(false);
        setBlogFormData({});
        setImageFile(null);
        fetchBlogPosts();
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormData(product);
    setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products/${id}`, { 
      method: 'DELETE',
      headers: {
        'x-admin-access': 'true'
      }
    });
    fetchProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    });
    if (imageFile) {
      data.append('imageFile', imageFile);
    }

    const url = isEditing ? `/api/products/${isEditing}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: data,
        headers: {
          'x-admin-access': 'true'
        }
      });
      if (res.ok) {
        setIsEditing(null);
        setIsAdding(false);
        setFormData({});
        setImageFile(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-dark text-white py-12">
        <div className="container-custom flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Admin Dashboard</h1>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mt-2">Manage your store content</p>
          </div>
          
          <div className="flex bg-white/10 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'products' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab('marquee')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'marquee' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Marquee
            </button>
            <button 
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'blog' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Blog
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom pt-12">
        {activeTab === 'products' && (
          <>
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => { setIsAdding(true); setIsEditing(null); setFormData({}); }}
                className="btn-primary flex items-center gap-2 px-6"
              >
                <Plus size={20} /> Add New Product
              </button>
            </div>
            <AnimatePresence>
          {(isEditing || isAdding) && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-border/10 border border-border p-8 mb-12 rounded-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="p-2 hover:bg-border/20 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input 
                        type="text" 
                        required
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-border pl-12 pr-4 py-3 focus:outline-none focus:border-primary font-bold"
                        placeholder="e.g. AlphaRex LED Headlights"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Price ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input 
                          type="number" 
                          required
                          value={formData.price || ''}
                          onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                          className="w-full border border-border pl-12 pr-4 py-3 focus:outline-none focus:border-primary font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Sale Price ($)</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input 
                          type="number" 
                          value={formData.salePrice || ''}
                          onChange={e => setFormData({ ...formData, salePrice: e.target.value ? parseFloat(e.target.value) : null })}
                          className="w-full border border-border pl-12 pr-4 py-3 focus:outline-none focus:border-primary font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Brand</label>
                      <input 
                        type="text" 
                        value={formData.brand || ''}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Category</label>
                      <select 
                        value={formData.category || ''}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold uppercase tracking-widest text-xs"
                      >
                        <option value="">Select Category</option>
                        <option value="lighting">Lighting</option>
                        <option value="exterior">Exterior</option>
                        <option value="interior">Interior</option>
                        <option value="camping">Camping</option>
                        <option value="wheels">Wheels</option>
                        <option value="suspension">Suspension</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Description</label>
                    <textarea 
                      rows={3}
                      value={formData.description || ''}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary font-medium text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Fitment Info</label>
                    <div className="relative">
                      <Info className="absolute left-4 top-4 text-muted" size={18} />
                      <textarea 
                        rows={2}
                        value={formData.fitment || ''}
                        onChange={e => setFormData({ ...formData, fitment: e.target.value })}
                        className="w-full border border-border pl-12 pr-4 py-3 focus:outline-none focus:border-primary font-medium text-sm"
                        placeholder="e.g. 2016-2023 Toyota Tacoma"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Product Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-white">
                        {imageFile ? (
                          <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" />
                        ) : formData.image ? (
                          <img src={formData.image} className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={24} className="text-muted" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={e => setImageFile(e.target.files?.[0] || null)}
                          className="hidden" 
                          id="image-upload" 
                        />
                        <label 
                          htmlFor="image-upload"
                          className="inline-block border border-dark px-4 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-dark hover:text-white transition-all"
                        >
                          Choose File
                        </label>
                        <p className="text-[10px] text-muted mt-2">Recommended: 800x800px JPG/PNG</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-border">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (
                      <>
                        <Save size={20} /> {isEditing ? 'Update Product' : 'Create Product'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-dark">
                <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Product</th>
                <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Category</th>
                <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Price</th>
                <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-border/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-border/20 overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-border/20 px-2 py-1">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">${product.price}</span>
                      {product.salePrice && (
                        <span className="text-[10px] text-primary font-black">SALE: ${product.salePrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}
        {activeTab === 'marquee' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Marquee Images</h2>
              <div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleMarqueeUpload}
                  className="hidden" 
                  id="marquee-upload" 
                  disabled={loading}
                />
                <label 
                  htmlFor="marquee-upload"
                  className="btn-primary flex items-center gap-2 px-6 cursor-pointer"
                >
                  <Upload size={20} /> {loading ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {marqueeImages.map((img) => (
                <div key={img.id} className="relative group border border-border rounded-xl overflow-hidden aspect-video bg-border/10">
                  <img src={img.image_url} alt="Marquee" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDeleteMarquee(img.id)}
                      className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {marqueeImages.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                  <p className="text-muted font-medium">No marquee images uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <>
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => { setIsAdding(true); setIsEditing(null); setBlogFormData({}); }}
                className="btn-primary flex items-center gap-2 px-6"
              >
                <Plus size={20} /> Add New Post
              </button>
            </div>
            
            <AnimatePresence>
              {(isEditing || isAdding) && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-border/10 border border-border p-8 mb-12 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">
                      {isEditing ? 'Edit Post' : 'Add New Post'}
                    </h2>
                    <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="p-2 hover:bg-border/20 rounded-full">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleBlogSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Title</label>
                        <input 
                          type="text" 
                          required
                          value={blogFormData.title || ''}
                          onChange={e => setBlogFormData({ ...blogFormData, title: e.target.value })}
                          className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Author</label>
                        <input 
                          type="text" 
                          value={blogFormData.author || ''}
                          onChange={e => setBlogFormData({ ...blogFormData, author: e.target.value })}
                          className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                          placeholder="e.g. Marco"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Excerpt</label>
                        <textarea 
                          rows={3}
                          value={blogFormData.excerpt || ''}
                          onChange={e => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                          className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Content</label>
                        <textarea 
                          rows={6}
                          required
                          value={blogFormData.content || ''}
                          onChange={e => setBlogFormData({ ...blogFormData, content: e.target.value })}
                          className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary font-medium text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted">Cover Image</label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-white">
                            {imageFile ? (
                              <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" />
                            ) : blogFormData.image ? (
                              <img src={blogFormData.image} className="w-full h-full object-cover" />
                            ) : (
                              <Upload size={24} className="text-muted" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={e => setImageFile(e.target.files?.[0] || null)}
                              className="hidden" 
                              id="blog-image-upload" 
                            />
                            <label 
                              htmlFor="blog-image-upload"
                              className="inline-block border border-dark px-4 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-dark hover:text-white transition-all"
                            >
                              Choose File
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-6 border-t border-border">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : (
                          <>
                            <Save size={20} /> {isEditing ? 'Update Post' : 'Create Post'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-dark">
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Post</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Date</th>
                    <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="border-b border-border hover:bg-border/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-border/20 overflow-hidden shrink-0">
                            {post.image && <img src={post.image} alt={post.title} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm line-clamp-1">{post.title}</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest">{post.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-medium text-muted">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditBlog(post)}
                            className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteBlog(post.id)}
                            className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {blogPosts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-muted font-medium">
                        No blog posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
