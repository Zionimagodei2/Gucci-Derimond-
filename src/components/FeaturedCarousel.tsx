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
        const res = await fetch('/api/products?t=' + Date.now());
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
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        // Add a small buffer (2px) to account for rounding errors
        setCanScroll(scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 2);
      }
    };
    
    checkScroll();
    
    // Use ResizeObserver to detect changes in container or content size (e.g., when images load)
    const observer = new ResizeObserver(() => {
      checkScroll();
    });
    
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
      // Also observe children to detect when they load/resize
      Array.from(scrollRef.current.children).forEach((child) => {
        observer.observe(child as Element);
      });
    }

    window.addEventListener('resize', checkScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, [products]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!canScroll || isHovered || isDragging) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If we've reached the end, scroll back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 350 + 24, behavior: 'smooth' }); // Scroll by one item width + gap
        }
      }
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(interval);
  }, [canScroll, isHovered, isDragging]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    if (Math.abs(walk) > 10) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
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
          onMouseDown={handleMouseDown}
          onMouseLeave={(e) => {
            handleMouseLeave();
            setIsHovered(false);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 overflow-x-auto no-scrollbar pb-8 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className="min-w-[280px] md:min-w-[350px] group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f4] mb-6">
                {product.badge && product.badge.split(',').map((b, index) => (
                  <span 
                    key={b}
                    className={`absolute left-4 z-10 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 ${b.trim() === 'SALE' ? 'bg-[#d32f2f]' : 'bg-black'}`}
                    style={{ top: `${16 + (index * 32)}px` }}
                  >
                    {b.trim()}
                  </span>
                ))}
                <Link to={`/products/${product.id}`} className="absolute inset-0" onClick={(e) => { if (hasDragged) e.preventDefault(); }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </Link>
                <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasDragged) return;
                      addToCart({ ...product, price: product.salePrice || product.price, quantity: 1 }, false);
                    }}
                    className="w-full bg-white text-black py-3 font-bold uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors shadow-lg"
                  >
                    Quick Add
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
                <Link to={`/products/${product.id}`} className="block" onClick={(e) => { if (hasDragged) e.preventDefault(); }}>
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
