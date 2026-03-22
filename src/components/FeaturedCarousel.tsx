import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice: number | null;
  rating: number;
  reviews: number;
  image: string;
  badge?: string | null;
}

interface FeaturedCarouselProps {
  currentProductId?: number;
}

export default function FeaturedCarousel({ currentProductId }: FeaturedCarouselProps = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        let data = await res.json();
        
        if (!Array.isArray(data)) {
          console.error('Failed to fetch products:', data);
          setProducts([]);
          return;
        }
        
        if (currentProductId) {
          data = data.filter((p: Product) => p.id !== currentProductId);
        }
        
        const featured = data.filter((p: Product) => p.badge?.includes('FEATURED'));
        
        // If no featured products, fallback to top rated
        if (featured.length === 0) {
          const topRated = data.sort((a: Product, b: Product) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            const reviewsA = a.reviews || 0;
            const reviewsB = b.reviews || 0;
            if (ratingB !== ratingA) return ratingB - ratingA;
            return reviewsB - reviewsA;
          });
          setProducts(topRated.slice(0, 5));
        } else {
          setProducts(featured);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [currentProductId]);

  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setCanScroll(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };
    
    // Check after a short delay to ensure DOM has updated
    const timeoutId = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScroll);
    };
  }, [products]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && canScroll) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          // Go back to start if at the end
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollTo({ left: scrollLeft + 350, behavior: 'smooth' });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [canScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-primary text-[12px] font-black uppercase tracking-[0.3em] mb-4 block">Hand-picked for you</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">{currentProductId ? 'Related Products' : 'Featured Products'}</h2>
          </div>
          {canScroll && (
            <div className="flex gap-4">
              <button 
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark hover:text-white transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark hover:text-white transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-proximity no-scrollbar pb-8 touch-pan-x"
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className="min-w-[280px] md:min-w-[350px] snap-start group"
            >
              <div className="relative aspect-square overflow-hidden bg-border/20 mb-6">
                {product.badge && product.badge.split(',').map((b, index) => (
                  <span 
                    key={b}
                    className={`absolute left-4 z-10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 ${b.trim() === 'SALE' ? 'bg-primary' : 'bg-dark'}`}
                    style={{ top: `${16 + (index * 32)}px` }}
                  >
                    {b.trim()}
                  </span>
                ))}
                <Link to={`/products/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    
                  />
                </Link>
                <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={() => addToCart({ ...product, price: product.salePrice || product.price, quantity: 1 })}
                    className="w-full bg-white text-dark py-3 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors shadow-xl"
                  >
                    <ShoppingBag size={16} /> Quick Add
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < Math.floor(product.rating || 5) ? "fill-primary text-primary" : "text-border"} 
                    />
                  ))}
                  <span className="text-[10px] text-crossed font-bold ml-1">({product.reviews || 0})</span>
                </div>
                <Link to={`/products/${product.id}`} className="block">
                  <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-3">
                  {product.salePrice ? (
                    <>
                      <span className="text-lg font-black text-primary">${product.salePrice.toFixed(2)}</span>
                      <span className="text-sm text-crossed line-through font-medium">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-black text-dark">${product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
