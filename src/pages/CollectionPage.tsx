import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Filter, ChevronRight, LayoutGrid, List, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  salePrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  badge: string | null;
  category: string;
}

export default function CollectionPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(9);
  
  const title = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'All Products';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        
        // Filter by category if slug matches a category
        const categoryMap: Record<string, string> = {
          'lighting': 'lighting',
          'exterior': 'exterior',
          'interior': 'interior',
          'camping-overland': 'camping',
          'wheels': 'wheels',
          'suspension': 'suspension'
        };

        const category = categoryMap[slug || ''];
        if (category) {
          setProducts(data.filter((p: Product) => p.category === category));
        } else {
          setProducts(data);
        }
        setVisibleCount(9); // Reset visible count when category changes
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const visibleProducts = products.slice(0, visibleCount);
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-border/10 py-4">
        <div className="container-custom flex items-center gap-2 text-[12px] uppercase font-bold tracking-widest text-muted">
          <Link to="/" className="hover:text-dark">Home</Link>
          <ChevronRight size={12} />
          <span className="text-dark">{title}</span>
        </div>
      </div>

      <div className="container-custom pt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-8">
              <div>
                <h4 className="text-[12px] font-black uppercase tracking-widest mb-4 border-b border-border pb-2">Filter By</h4>
                <div className="space-y-6">
                  <div>
                    <h5 className="text-xs font-bold uppercase mb-3">Availability</h5>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                        <input type="checkbox" className="accent-primary" /> In Stock
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                        <input type="checkbox" className="accent-primary" /> Out of Stock
                      </label>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase mb-3">Price</h5>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" className="w-full border border-border p-2 text-xs focus:outline-none focus:border-primary" />
                      <span className="text-muted">-</span>
                      <input type="number" placeholder="Max" className="w-full border border-border p-2 text-xs focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase mb-3">Brand</h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {['AlphaRex', 'Baja Designs', 'CBI Offroad', 'Meso Customs', 'Morimoto', 'Prinsu', 'ROAM'].map(brand => (
                        <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                          <input type="checkbox" className="accent-primary" /> {brand}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 uppercase">{title}</h1>
                <p className="text-muted text-sm font-medium">{products.length} Products</p>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-4">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-border px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-border/10 transition-colors"
                >
                  <Filter size={16} /> Filters
                </button>
                <div className="flex items-center border border-border rounded-sm overflow-hidden">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-border/20 text-dark' : 'hover:bg-border/10 text-muted'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-border/20 text-dark' : 'hover:bg-border/10 text-muted'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
                <select className="border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer">
                  <option>Featured</option>
                  <option>Best Selling</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>New Arrivals</option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="py-20 text-center border border-border rounded-xl bg-border/5">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No Products Found</h2>
                <p className="text-muted font-medium">We couldn't find any products in this category.</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10" : "flex flex-col gap-8"}>
                  {visibleProducts.map((product) => (
                    <div key={product.id} className={`group ${viewMode === 'grid' ? 'flex flex-col' : 'flex flex-col sm:flex-row gap-6 border-b border-border pb-8'}`}>
                      <div className={`relative overflow-hidden bg-border/20 ${viewMode === 'grid' ? 'aspect-square mb-4' : 'w-full sm:w-48 aspect-square shrink-0'}`}>
                        <Link to={`/products/${product.id}`}>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </Link>
                        {product.badge && (
                          <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-black text-white ${product.badge === 'SALE' ? 'bg-primary' : 'bg-dark'}`}>
                            {product.badge}
                          </span>
                        )}
                        {viewMode === 'grid' && (
                          <button 
                            onClick={() => addToCart({ ...product, price: product.salePrice || product.price, quantity: 1 })}
                            className="absolute bottom-0 left-0 right-0 bg-dark text-white font-black py-3 text-[11px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300 hover:bg-primary"
                          >
                            Quick Add
                          </button>
                        )}
                      </div>
                      
                      <div className={`flex flex-col gap-1 ${viewMode === 'list' ? 'justify-center flex-grow' : ''}`}>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < product.rating ? "fill-star text-star" : "text-border"} />
                          ))}
                          <span className="text-[10px] text-muted font-bold ml-1">({product.reviews})</span>
                        </div>
                        <Link to={`/products/${product.id}`} className="text-sm font-bold line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </Link>
                        {viewMode === 'list' && product.brand && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">{product.brand}</span>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {product.salePrice ? (
                            <>
                              <span className="text-primary font-black text-lg">${product.salePrice}</span>
                              <span className="text-crossed text-sm line-through font-medium">${product.price}</span>
                            </>
                          ) : (
                            <span className="font-black text-lg">${product.price}</span>
                          )}
                        </div>
                        {viewMode === 'list' && (
                          <div className="mt-4 flex items-center gap-4">
                            <button 
                              onClick={() => addToCart({ ...product, price: product.salePrice || product.price, quantity: 1 })}
                              className="btn-primary px-6 py-2 text-[10px]"
                            >
                              Add to Cart
                            </button>
                            <Link to={`/products/${product.id}`} className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                              View Details
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {visibleCount < products.length && (
                  <div className="mt-20 flex flex-col items-center gap-6">
                    <div className="w-full max-w-xs h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(visibleCount / products.length) * 100}%` }} />
                    </div>
                    <p className="text-xs text-muted font-bold uppercase tracking-widest">Showing {visibleCount} of {products.length} products</p>
                    <button 
                      onClick={handleLoadMore}
                      className="border-2 border-dark px-16 py-4 font-black uppercase tracking-widest hover:bg-dark hover:text-white transition-all duration-300"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] lg:hidden"
          />
        )}
        {isFilterOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[201] lg:hidden flex flex-col"
          >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-tighter">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-border/50 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto p-6">
                <div className="space-y-8">
                  <div>
                    <h5 className="text-xs font-bold uppercase mb-4">Availability</h5>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-sm cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-primary" /> In Stock
                      </label>
                      <label className="flex items-center gap-3 text-sm cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-primary" /> Out of Stock
                      </label>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase mb-4">Price Range</h5>
                    <div className="flex items-center gap-3">
                      <input type="number" placeholder="Min" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary" />
                      <span className="text-muted">-</span>
                      <input type="number" placeholder="Max" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase mb-4">Brand</h5>
                    <div className="space-y-3">
                      {['AlphaRex', 'Baja Designs', 'CBI Offroad', 'Meso Customs', 'Morimoto', 'Prinsu', 'ROAM'].map(brand => (
                        <label key={brand} className="flex items-center gap-3 text-sm cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 accent-primary" /> {brand}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-border">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="btn-primary w-full py-4 text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
