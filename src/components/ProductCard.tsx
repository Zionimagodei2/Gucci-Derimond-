import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  salePrice: number | null;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string | null;
  category?: string;
  fitment?: string;
  description?: string;
}

export const ProductCard: React.FC<{ product: Product, viewMode?: 'grid' | 'list' }> = ({ product, viewMode = 'grid' }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const rating = product.rating || 5;
  const reviews = product.reviews || 0;

  return (
    <div className={`group ${viewMode === 'grid' ? 'flex flex-col' : 'flex flex-col sm:flex-row gap-6 border-b border-border pb-8'}`}>
      <div className={`relative overflow-hidden bg-border/20 ${viewMode === 'grid' ? 'aspect-square mb-4' : 'w-full sm:w-48 aspect-square shrink-0'}`}>
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            
          />
        </Link>
        {product.badge && product.badge.split(',').map((b, index) => (
          <span 
            key={b} 
            className={`absolute left-3 px-2 py-1 text-[10px] font-black text-white ${b.trim() === 'SALE' ? 'bg-primary' : 'bg-dark'}`}
            style={{ top: `${12 + (index * 28)}px` }}
          >
            {b.trim()}
          </span>
        ))}
        {viewMode === 'grid' && (
          <button 
            onClick={() => {
              addToCart({ ...product, price: product.salePrice || product.price, quantity: 1 }, false);
              setIsCartOpen(false);
              navigate('/checkout');
            }}
            className="absolute bottom-0 left-0 right-0 bg-dark text-white font-black py-3 text-[11px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300 hover:bg-primary"
          >
            Quick Buy
          </button>
        )}
      </div>
      
      <div className={`flex flex-col gap-1 ${viewMode === 'list' ? 'justify-center flex-grow' : ''}`}>
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < Math.floor(rating || 5) ? "fill-star text-star" : "text-border"} />
          ))}
          <span className="text-[10px] text-muted font-bold ml-1">({reviews || 0})</span>
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
              <span className="text-primary font-black text-lg">${product.salePrice.toFixed(2)}</span>
              <span className="text-crossed text-sm line-through font-medium">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-black text-lg">${product.price.toFixed(2)}</span>
          )}
        </div>
        {viewMode === 'list' && (
          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={() => {
                addToCart({ ...product, price: product.salePrice || product.price, quantity: 1 }, false);
                setIsCartOpen(false);
                navigate('/checkout');
              }}
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
  );
}
