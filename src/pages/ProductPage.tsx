import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ChevronRight, ChevronLeft, Minus, Plus, Share2, Facebook, Twitter, Pin as Pinterest, Link as LinkIcon, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import FeaturedCarousel from '../components/FeaturedCarousel';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  salePrice: number | null;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  fitment: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/" className="btn-primary px-8">Back to Home</Link>
      </div>
    );
  }

  const images = [product.image];

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-border/10 py-4">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] uppercase font-bold tracking-widest text-muted">
            <Link to="/" className="hover:text-dark">Home</Link>
            <ChevronRight size={12} />
            <Link to="/collections/all" className="hover:text-dark">Products</Link>
            <ChevronRight size={12} />
            <span className="text-dark truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
          </div>
          <button onClick={() => window.history.back()} className="text-[12px] uppercase font-bold tracking-widest text-muted hover:text-dark flex items-center gap-1">
            <ChevronLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div className="container-custom pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image Gallery (60%) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square bg-white overflow-hidden p-8 border border-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-white border border-gray-100 p-2 cursor-pointer hover:border-black transition-colors">
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Purchase Panel (40%) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <Link to={`/collections/${product.brand?.toLowerCase() || 'all'}`} className="text-[12px] uppercase font-bold tracking-widest text-primary hover:underline mb-2 block">
                {product.brand || 'Brand'}
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tighter leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating || 5) ? "fill-star text-star" : "text-border"} />
                  ))}
                </div>
                <span className="text-sm text-muted font-bold underline cursor-pointer">{product.reviews || 0} Reviews</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">${Number(product.salePrice || product.price).toFixed(2)}</span>
                {product.salePrice && (
                  <span className="text-xl text-crossed line-through">${Number(product.price).toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-[12px] font-bold uppercase tracking-widest text-muted hover:text-dark flex items-center gap-2 transition-colors"
                >
                  <Info size={16} /> Which gen is your Tacoma?
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border h-12">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 h-full hover:bg-border/20 transition-colors"><Minus size={16} /></button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="px-4 h-full hover:bg-border/20 transition-colors"><Plus size={16} /></button>
                  </div>
                  <button 
                    onClick={() => addToCart({ ...product, price: product.salePrice || product.price, quantity })}
                    className="btn-primary flex-grow h-12"
                  >
                    ADD TO CART
                  </button>
                </div>
                  <button 
                    onClick={() => {
                      addToCart({ ...product, price: product.salePrice || product.price, quantity }, false);
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="bg-dark text-white font-bold h-12 uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    BUY IT NOW
                  </button>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="space-y-4">
                <details className="group border-b border-border pb-4" open>
                  <summary className="flex items-center justify-between font-bold uppercase tracking-widest text-sm cursor-pointer list-none">
                    Description
                    <Plus size={16} className="group-open:rotate-45 transition-transform" />
                  </summary>
                  <div className="pt-4 text-sm text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                </details>
                <details className="group border-b border-border pb-4">
                  <summary className="flex items-center justify-between font-bold uppercase tracking-widest text-sm cursor-pointer list-none">
                    Fitment
                    <Plus size={16} className="group-open:rotate-45 transition-transform" />
                  </summary>
                  <div className="pt-4 text-sm text-muted leading-relaxed">
                    {product.fitment}
                  </div>
                </details>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <span className="text-[12px] font-bold uppercase tracking-widest text-muted">Share:</span>
              <div className="flex items-center gap-4 text-muted">
                <button className="hover:text-primary transition-colors"><Facebook size={18} /></button>
                <button className="hover:text-primary transition-colors"><Twitter size={18} /></button>
                <button className="hover:text-primary transition-colors"><Pinterest size={18} /></button>
                <button className="hover:text-primary transition-colors"><LinkIcon size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedCarousel currentProductId={product.id} />

      {/* Fitment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-lg p-8 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-border/50 rounded-full transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6">Find Your Fitment</h2>
              <p className="text-muted text-sm mb-8">Select your Tacoma's generation to find compatible parts.</p>
              
              <div className="space-y-4">
                <select className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary transition-colors font-bold uppercase tracking-widest text-sm">
                  <option>Select Generation</option>
                  <option>4th Gen (2024-2026)</option>
                  <option>3rd Gen (2016-2023)</option>
                  <option>2nd Gen (2005-2015)</option>
                  <option>1st Gen (1996-2004)</option>
                </select>
                <button onClick={() => setIsModalOpen(false)} className="btn-primary w-full">
                  FIND COMPATIBLE PARTS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
