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
      <div className={`relative overflow-hidden bg-white ${viewMode === 'grid' ? 'aspect-square mb-4' : 'w-full sm:w-48 aspect-square shrink-0'}`}>
        <Link to={`/products/${product.id}`} className="absolute inset-0 p-4">
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
        {product.badge && product.badge.split(',').map((b, index) => (
          <span 
            key={b} 
            className={`absolute left-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${b.trim() === 'SALE' ? 'bg-[#d32f2f]' : 'bg-black'}`}
            style={{ top: `${12 + (index * 28)}px` }}
          >
            {b.trim()}
          </span>
        ))}
        {viewMode === 'grid' && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart({ ...product, price: product.salePrice || product.price, quantity: 1 }, false);
              setIsCartOpen(true);
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white text-black font-bold py-3 text-[12px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white shadow-lg"
          >
            Quick Add
          </button>
        )}
      </div>
      
      <div className={`flex flex-col gap-1 ${viewMode === 'list' ? 'justify-center flex-grow' : ''}`}>
        {product.brand && (
          <span className="text-[11px] font-medium uppercase tracking-widest text-gray-500">{product.brand}</span>
        )}
        <Link to={`/products/${product.id}`} className="text-[15px] font-medium leading-snug hover:underline decoration-1 underline-offset-4">
          {product.name}
        </Link>
        
        {reviews > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(rating || 5) ? "fill-black text-black" : "text-gray-300"} />
            ))}
            <span className="text-[11px] text-gray-500 ml-1">({reviews})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1">
          {product.salePrice ? (
            <>
              <span className="text-[#d32f2f] font-semibold text-[15px]">${product.salePrice.toFixed(2)}</span>
              <span className="text-gray-400 text-[13px] line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-semibold text-[15px]">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        {viewMode === 'list' && (
          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={() => {
                addToCart({ ...product, price: product.salePrice || product.price, quantity: 1 }, false);
                setIsCartOpen(true);
              }}
              className="bg-black text-white px-8 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
            <Link to={`/products/${product.id}`} className="text-[12px] font-bold uppercase tracking-widest hover:underline underline-offset-4">
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
