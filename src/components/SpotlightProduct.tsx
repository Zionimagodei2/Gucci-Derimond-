import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function SpotlightProduct() {
  const { addToCart } = useCart();
  
  const product = {
    id: 10,
    name: "Marco Tac Rogue Front Bumper (2016-2023)",
    price: 1599,
    salePrice: 1399,
    image: "https://picsum.photos/seed/spotlight/1200/800",
    description: "The ultimate front-end protection for your Tacoma. Lightweight, durable, and winch-ready. Designed for maximum approach angle and aggressive styling."
  };

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="bg-dark text-white overflow-hidden flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto lg:h-[600px] overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
            <span className="text-primary text-[12px] font-black uppercase tracking-[0.3em] mb-4">Product Spotlight</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-6 leading-tight">
              {product.name}
            </h2>
            <p className="text-crossed text-lg mb-10 leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex items-center gap-6 mb-10">
              <span className="text-3xl font-black text-white">${product.salePrice}</span>
              <span className="text-xl text-crossed line-through font-medium">${product.price}</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => addToCart({ ...product, price: product.salePrice, quantity: 1 })}
                className="btn-primary flex items-center gap-3 px-10"
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
              <Link to={`/products/${product.id}`} className="border border-white/20 px-10 py-3 font-black uppercase tracking-widest hover:bg-white hover:text-dark transition-all">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
