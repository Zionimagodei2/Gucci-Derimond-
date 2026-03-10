import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Search, User, Star, ShoppingBag, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Shop By Vehicle', path: '/collections/shop-by-vehicle' },
  { name: 'Exterior', path: '/collections/exterior' },
  { name: 'Interior', path: '/collections/interior' },
  { name: 'Lighting', path: '/collections/lighting' },
  { name: 'Camping & Overland', path: '/collections/camping-overland' },
  { name: 'Brands', path: '/collections/brands' },
  { name: 'Sale', path: '/collections/sale', color: 'text-primary' },
  { name: 'Marco Talk', path: '/blogs/news' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, openLogin } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        />
      )}
      {isOpen && (
        <motion.div
          key="menu"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] flex flex-col"
        >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Link to="/" onClick={onClose} className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-dark rounded-sm">
                   <svg viewBox="0 0 100 100" className="w-5 h-5 fill-white">
                    <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="8" />
                    <path d="M50 5 L50 50 L90 75 M50 50 L10 75" fill="none" stroke="currentColor" strokeWidth="8" />
                    <path d="M30 35 L50 45 L70 35 L70 55 L50 65 L30 55 Z" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-black uppercase tracking-tighter text-lg">MarcoTacLife</span>
              </Link>
              <button onClick={onClose} className="p-2 hover:bg-border/50 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 border-b border-border">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="w-full bg-border/20 border border-border rounded-lg py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  <Search size={20} />
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              <ul className="p-6 space-y-1">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      onClick={onClose}
                      className={`flex items-center justify-between py-4 border-b border-border/50 text-sm font-black uppercase tracking-widest ${item.color || 'text-dark'}`}
                    >
                      {item.name}
                      <ChevronRight size={16} className="text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="p-6 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { onClose(); openLogin(); }}
                  className="flex flex-col items-center justify-center p-4 bg-border/10 rounded-xl gap-2 hover:bg-border/20 transition-colors"
                >
                  <User size={24} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{user ? (user.isAdmin ? 'Admin' : 'Account') : 'Sign In'}</span>
                </button>
                {user?.isAdmin ? (
                  <Link 
                    to="/admin" 
                    onClick={onClose}
                    className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-xl gap-2 hover:bg-primary/20 transition-colors"
                  >
                    <ShoppingBag size={24} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                  </Link>
                ) : (
                  <Link 
                    to="/pages/rewards" 
                    onClick={onClose}
                    className="flex flex-col items-center justify-center p-4 bg-border/10 rounded-xl gap-2 hover:bg-border/20 transition-colors"
                  >
                    <Star size={24} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Rewards</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="p-8 bg-dark text-white">
              <div className="flex items-center justify-center gap-8 mb-8">
                <a href="https://www.instagram.com/james_yotas7?igsh=MW9jd2tzc2RwYWhtcg==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
                <a href="https://www.tiktok.com/@yota.offroad_?_r=1&_t=ZP-94QpuL889K2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
              </div>
              <p className="text-[10px] text-center text-crossed uppercase tracking-[0.2em] font-bold">
                © 2025 Marco Tac Life
              </p>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
