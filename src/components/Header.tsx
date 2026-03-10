import React, { useState } from 'react';
import { Search, User, ShoppingCart, Star, LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { setIsCartOpen, cartCount } = useCart();
  const { user, openLogin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-dark text-white h-[70px] flex items-center sticky top-0 z-50">
      <div className="container-custom w-full flex items-center justify-between lg:grid lg:grid-cols-3">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              {/* Stylized Hexagon/Cube Icon mimicking the provided image */}
              <svg viewBox="0 0 100 100" className="w-full h-full fill-white group-hover:fill-primary transition-colors duration-300">
                <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="8" />
                <path d="M50 5 L50 50 L90 75 M50 50 L10 75" fill="none" stroke="currentColor" strokeWidth="8" />
                <path d="M30 35 L50 45 L70 35 L70 55 L50 65 L30 55 Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-bold tracking-tight">MarcoTacLife</span>
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.3em] text-primary font-bold">Superstore</span>
            </div>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="relative hidden lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mods, parts, accessories..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:bg-white focus:text-dark transition-all placeholder:text-white/40"
            />
            <div className="absolute right-1 top-1 bottom-1 w-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-hover transition-colors">
              <Search size={18} className="text-white" />
            </div>
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-end gap-3 sm:gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary hidden md:block leading-none mb-1">Hi, {user.name.split(' ')[0]}</span>
                {user.isAdmin && (
                  <Link to="/admin" className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-primary transition-colors leading-none">
                    Admin Dashboard
                  </Link>
                )}
              </div>
              <button 
                onClick={logout}
                className="hover:text-primary transition-colors flex items-center gap-1 group"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={openLogin}
              className="hover:text-primary transition-colors flex items-center gap-1 group"
            >
              <User size={22} />
            </button>
          )}
          
          <Link to="/pages/rewards" className="hover:text-primary transition-colors flex items-center gap-1 group">
            <Star size={22} className="group-hover:fill-primary transition-all" />
            <div className="flex flex-col leading-none hidden lg:flex">
              <span className="text-[10px] font-bold uppercase">Marco</span>
              <span className="text-[10px] font-bold uppercase text-primary">Points</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="hover:text-primary transition-colors relative group"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
