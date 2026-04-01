import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Upload, Package, DollarSign, Tag, Info, ShieldAlert, Eye, Search, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
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
  badge?: string | null;
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

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: any[];
}

export default function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [marqueeImages, setMarqueeImages] = useState<MarqueeImage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'marquee' | 'blog' | 'featured' | 'orders' | 'visits' | 'support'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [visits, setVisits] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newVisitAlert, setNewVisitAlert] = useState(false);
  const [lastVisitId, setLastVisitId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'product' | 'marquee' | 'blog' | null;
    id: number | null;
  }>({ isOpen: false, type: null, id: null });

  useEffect(() => {
    if (user?.isAdmin) {
      fetchProducts();
      fetchMarqueeImages();
      fetchBlogPosts();
      fetchOrders();
      fetchVisits();
      fetchMessages();

      // Poll for visits every 10 seconds
      const interval = setInterval(fetchVisits, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/visits', {
        headers: { 'x-admin-access': 'true' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        if (lastVisitId && data.length > 0 && data[0].id > lastVisitId) {
          setNewVisitAlert(true);
          setTimeout(() => setNewVisitAlert(false), 5000);
        }
        setVisits(data);
        if (data.length > 0) setLastVisitId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages', {
        headers: { 'x-admin-access': 'true' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'x-admin-access': 'true' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-access': 'true'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

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
    try {
      const res = await fetch('/api/products?t=' + Date.now());
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Failed to fetch products:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchMarqueeImages = async () => {
    try {
      const res = await fetch('/api/marquee?t=' + Date.now());
      const data = await res.json();
      if (Array.isArray(data)) {
        setMarqueeImages(data);
      } else {
        setMarqueeImages([]);
      }
    } catch (error) {
      console.error('Error fetching marquee images:', error);
      setMarqueeImages([]);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogPosts(data);
      } else {
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
    }
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
      if (res.ok) {
        fetchMarqueeImages();
      } else {
        const errData = await res.json().catch(() => null);
        alert(`Failed to upload marquee image: ${errData?.error || res.statusText || 'Unknown error. File might be too large.'}`);
      }
    } catch (error) {
      console.error('Error uploading marquee image:', error);
      alert('Network error while uploading marquee image. Please try again.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDeleteMarquee = (id: number) => {
    setDeleteConfirmation({ isOpen: true, type: 'marquee', id });
  };

  // --- Blog Logic ---
  const handleEditBlog = (post: BlogPost) => {
    setIsEditing(post.id);
    setBlogFormData(post);
    setIsAdding(false);
    setImageFile(null);
  };

  const handleDeleteBlog = (id: number) => {
    setDeleteConfirmation({ isOpen: true, type: 'blog', id });
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
      } else {
        const errData = await res.json().catch(() => null);
        alert(`Failed to save blog post: ${errData?.error || res.statusText || 'Unknown error. File might be too large.'}`);
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Network error while saving blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormData(product);
    setIsAdding(false);
    setImageFile(null);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmation({ isOpen: true, type: 'product', id });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirmation;
    if (!type || id === null) return;

    try {
      if (type === 'product') {
        await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { 'x-admin-access': 'true' } });
        fetchProducts();
      } else if (type === 'marquee') {
        await fetch(`/api/marquee/${id}`, { method: 'DELETE', headers: { 'x-admin-access': 'true' } });
        fetchMarqueeImages();
      } else if (type === 'blog') {
        await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers: { 'x-admin-access': 'true' } });
        fetchBlogPosts();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    } finally {
      setDeleteConfirmation({ isOpen: false, type: null, id: null });
    }
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
      } else {
        const errData = await res.json().catch(() => null);
        alert(`Failed to save product: ${errData?.error || res.statusText || 'Unknown error. File might be too large.'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Network error while saving product. Please try again.');
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
          
          <div className="flex overflow-x-auto bg-white/10 p-1 rounded-lg no-scrollbar w-full md:w-auto">
            <button 
              onClick={() => { setActiveTab('products'); setIsEditing(null); setIsAdding(false); setImageFile(null); }}
              className={`whitespace-nowrap px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'products' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Products
            </button>
            <button 
              onClick={() => { setActiveTab('marquee'); setIsEditing(null); setIsAdding(false); setImageFile(null); }}
              className={`whitespace-nowrap px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'marquee' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Marquee
            </button>
            <button 
              onClick={() => { setActiveTab('blog'); setIsEditing(null); setIsAdding(false); setImageFile(null); }}
              className={`whitespace-nowrap px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'blog' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => { setActiveTab('featured'); setIsEditing(null); setIsAdding(false); setImageFile(null); }}
              className={`whitespace-nowrap px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'featured' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Featured
            </button>
            <button 
              onClick={() => { setActiveTab('orders'); setIsEditing(null); setIsAdding(false); setImageFile(null); }}
              className={`whitespace-nowrap px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'orders' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Orders
            </button>
            <button 
              onClick={() => { setActiveTab('visits'); setIsEditing(null); setIsAdding(false); setImageFile(null); }}
              className={`whitespace-nowrap px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'visits' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Visits
            </button>
            <button 
              onClick={() => { setActiveTab('support'); setIsEditing(null); setIsAdding(false); setImageFile(null); fetchMessages(); }}
              className={`whitespace-nowrap px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTab === 'support' ? 'bg-white text-dark' : 'hover:bg-white/20'}`}
            >
              Support
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom pt-12">
        {activeTab === 'products' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-border pl-12 pr-4 py-3 focus:outline-none focus:border-primary font-bold rounded-lg bg-border/5"
                />
              </div>
              <button 
                onClick={() => { setIsAdding(true); setIsEditing(null); setFormData({}); setImageFile(null); }}
                className="btn-primary flex items-center gap-2 px-6 w-full md:w-auto"
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
                <button onClick={() => { setIsEditing(null); setIsAdding(false); setImageFile(null); }} className="p-2 hover:bg-border/20 rounded-full">
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
                        <option value="apparel">Apparel</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.badge?.includes('FEATURED') || false}
                        onChange={e => {
                          let badges = formData.badge ? formData.badge.split(',').map(b => b.trim()) : [];
                          if (e.target.checked) {
                            if (!badges.includes('FEATURED')) badges.push('FEATURED');
                          } else {
                            badges = badges.filter(b => b !== 'FEATURED');
                          }
                          setFormData({ ...formData, badge: badges.join(',') || null });
                        }}
                        className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                      />
                      <span className="text-sm font-bold">Feature on Homepage</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.badge?.includes('SALE') || false}
                        onChange={e => {
                          let badges = formData.badge ? formData.badge.split(',').map(b => b.trim()) : [];
                          if (e.target.checked) {
                            if (!badges.includes('SALE')) badges.push('SALE');
                          } else {
                            badges = badges.filter(b => b !== 'SALE');
                          }
                          setFormData({ ...formData, badge: badges.join(',') || null });
                        }}
                        className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                      />
                      <span className="text-sm font-bold">Mark as Sale</span>
                    </label>
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
                    <div className="flex flex-col gap-4">
                      <div className="w-full aspect-square max-w-[240px] border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-white rounded-xl">
                        {previewUrl ? (
                          <img src={previewUrl} className="w-full h-full object-cover" />
                        ) : formData.image ? (
                          <img src={formData.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center text-muted">
                            <Upload size={32} className="mb-2" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">No Image</span>
                          </div>
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
                          className="inline-block border border-dark px-6 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-dark hover:text-white transition-all rounded-md"
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
              {paginatedProducts.map((product) => (
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
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted font-medium">
                    No products found. Click "Add New Product" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-border rounded-lg hover:bg-border/10 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-border rounded-lg hover:bg-border/10 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
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
                onClick={() => { setIsAdding(true); setIsEditing(null); setBlogFormData({}); setImageFile(null); }}
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
                    <button onClick={() => { setIsEditing(null); setIsAdding(false); setImageFile(null); }} className="p-2 hover:bg-border/20 rounded-full">
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
                        <div className="flex flex-col gap-4">
                          <div className="w-full aspect-video max-w-[320px] border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-white rounded-xl">
                            {previewUrl ? (
                              <img src={previewUrl} className="w-full h-full object-cover" />
                            ) : blogFormData.image ? (
                              <img src={blogFormData.image} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center text-muted">
                                <Upload size={32} className="mb-2" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">No Image</span>
                              </div>
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
                              className="inline-block border border-dark px-6 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-dark hover:text-white transition-all rounded-md"
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
        {activeTab === 'featured' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Featured Carousel</h2>
              <p className="text-sm text-muted font-medium">Select products to feature on the homepage carousel</p>
            </div>
            
            <div className="bg-white border border-border rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px] text-muted">Product</th>
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px] text-muted">Price</th>
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px] text-muted">Category</th>
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px] text-muted text-center">Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const isFeatured = product.badge?.includes('FEATURED');
                    return (
                      <tr key={product.id} className="border-b border-border hover:bg-background/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-background rounded-md overflow-hidden shrink-0 border border-border">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                              <p className="text-xs text-muted uppercase tracking-widest">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-sm">${Number(product.price).toFixed(2)}</td>
                        <td className="p-4 text-sm capitalize">{product.category}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/products/${product.id}/featured`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'x-admin-access': 'true'
                                  },
                                  body: JSON.stringify({ isFeatured: !isFeatured })
                                });
                                if (res.ok) {
                                  fetchProducts();
                                }
                              } catch (e) {
                                console.error('Error toggling featured status', e);
                              }
                            }}
                            className={`w-12 h-6 rounded-full relative transition-colors ${isFeatured ? 'bg-primary' : 'bg-border'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isFeatured ? 'left-7' : 'left-1'}`} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted font-medium">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Manage Orders</h2>
            </div>
            
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-border/10 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Order ID</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Date</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Customer</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Total</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                    <th className="text-right py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-border/5 transition-colors">
                      <td className="py-4 px-4 font-bold">{order.id}</td>
                      <td className="py-4 px-4 text-muted">{order.date}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold">{order.customer?.firstName} {order.customer?.lastName}</div>
                        <div className="text-xs text-muted">{order.customer?.email}</div>
                      </td>
                      <td className="py-4 px-4 font-black text-dark">${Number(order.total).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border border-border rounded px-2 py-1 text-xs font-bold uppercase tracking-widest bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 hover:bg-border/10 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} className="text-muted" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted font-medium">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'visits' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Recent Website Visits</h2>
              <button 
                onClick={fetchVisits}
                className="text-[10px] font-black uppercase tracking-widest border border-border px-4 py-2 hover:bg-border/10 rounded-md"
              >
                Refresh
              </button>
            </div>

            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-border/10 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Time</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">Path</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">IP Address</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit) => (
                    <tr key={visit.id} className="border-b border-border hover:bg-border/5 transition-colors">
                      <td className="py-4 px-4 text-xs font-bold">
                        {new Date(visit.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded">
                          {visit.path}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-muted">
                        {visit.ip}
                      </td>
                      <td className="py-4 px-4 text-[10px] text-muted truncate max-w-[200px]">
                        {visit.userAgent}
                      </td>
                    </tr>
                  ))}
                  {visits.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted font-medium">
                        No visits recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Customer Support Messages</h2>
              <button 
                onClick={fetchMessages}
                className="text-[10px] font-black uppercase tracking-widest border border-border px-4 py-2 hover:bg-border/10 rounded-md"
              >
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {messages.map((msg: any) => (
                <div key={msg.id} className="bg-white border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-sm">{msg.name}</h4>
                      <p className="text-xs text-primary font-bold">{msg.email}</p>
                    </div>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-widest bg-border/20 px-3 py-1 rounded-full">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-border/5 p-4 rounded-lg border border-border/50">
                    <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <a 
                      href={`mailto:${msg.email}?subject=Re: Marco Tac Lifestyle Support Inquiry`}
                      className="text-[10px] font-black uppercase tracking-widest bg-dark text-white px-6 py-2 rounded-md hover:bg-primary transition-colors"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-border rounded-xl">
                  <Mail size={48} className="text-muted mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No Messages Yet</h3>
                  <p className="text-muted font-medium">Customer inquiries will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <AnimatePresence>
          {newVisitAlert && (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-24 right-6 z-[200] bg-primary text-white p-6 rounded-xl shadow-2xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Eye size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">New Visit Alert</p>
                <p className="text-sm font-bold">A customer just visited the website!</p>
              </div>
              <button onClick={() => setNewVisitAlert(false)} className="p-1 hover:bg-white/10 rounded-full">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setDeleteConfirmation({ isOpen: false, type: null, id: null })} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md p-8 rounded-xl shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-center">Confirm Deletion</h3>
              <p className="text-muted mb-8 text-center font-medium">
                Are you sure you want to delete this {deleteConfirmation.type}? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirmation({ isOpen: false, type: null, id: null })} 
                  className="flex-1 py-3 border border-border font-bold uppercase tracking-widest text-xs hover:bg-border/10 transition-colors rounded-md"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex-1 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-colors rounded-md"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setSelectedOrder(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl"
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 hover:bg-border/10 rounded-full transition-colors"
              >
                <X size={24} className="text-muted" />
              </button>
              
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Order Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-bold">ID:</span> {selectedOrder.id}</p>
                    <p><span className="font-bold">Date:</span> {selectedOrder.date}</p>
                    <p><span className="font-bold">Status:</span> {selectedOrder.status}</p>
                    <p><span className="font-bold">Total:</span> ${Number(selectedOrder.total).toFixed(2)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-bold">Name:</span> {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                    <p><span className="font-bold">Email:</span> {selectedOrder.customer?.email}</p>
                    <p><span className="font-bold">Address:</span> {selectedOrder.customer?.address}</p>
                    <p><span className="font-bold">Location:</span> {selectedOrder.customer?.city}, {selectedOrder.customer?.state} {selectedOrder.customer?.zipCode}</p>
                    <p><span className="font-bold">Country:</span> {selectedOrder.customer?.country}</p>
                  </div>
                </div>
              </div>

              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">Order Items</h4>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center bg-border/5 p-3 rounded-lg border border-border">
                    <div className="w-16 h-16 bg-white shrink-0 rounded overflow-hidden border border-border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-bold text-sm line-clamp-1">{item.name}</h5>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-black">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="px-8 py-3 bg-dark text-white font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors rounded-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
