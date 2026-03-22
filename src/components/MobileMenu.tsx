import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Search, User, Star, ShoppingBag, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    name: 'Accessories', 
    path: '/collections/accessories',
    subItems: [
      { name: 'All Accessories', path: '/collections/accessories' },
      { name: 'Velcro Bags', path: '/collections/velcro-bag' },
      { name: 'Camper Storage', path: '/collections/camper-storage' },
    ]
  },
  { 
    name: 'Exterior', 
    path: '/collections/exterior',
    subItems: [
      { name: 'Vehicle Decals', path: '/collections/vehicle-decals' },
      { name: 'Replacement Parts', path: '/collections/replacement-part' },
    ]
  },
  { 
    name: 'Wheels', 
    path: '/collections/wheels',
    subItems: [
      { name: 'All Wheels', path: '/collections/wheels' },
      { name: 'Truck, SUV, & Jeep Wheels', path: '/collections/truck-suv-jeep-wheels' },
    ]
  },
  { 
    name: 'Camping & Overland', 
    path: '/collections/camping-overland',
    subItems: [
      { name: 'Rooftop Tents', path: '/collections/rooftop-tent' },
    ]
  },
  { 
    name: 'Apparel & Print', 
    path: '/collections/print-material',
    subItems: [
      { name: 'Print Material', path: '/collections/print-material' },
    ]
  },
  { name: 'Sale', path: '/collections/sale', color: 'text-primary' },
  { name: 'Blog', path: '/blogs/news' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, openLogin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onClose();
    }
  };

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

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
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-border/20 border border-border rounded-lg py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                  <Search size={20} />
                </button>
              </form>
            </div>

            <div className="flex-grow overflow-y-auto">
              <ul className="p-6 space-y-1">
                {menuItems.map((item) => (
                  <li key={item.name} className="border-b border-border/50">
                    <div className="flex items-center justify-between py-4">
                      <Link 
                        to={item.path} 
                        onClick={onClose}
                        className={`text-sm font-black uppercase tracking-widest flex-grow ${item.color || 'text-dark'}`}
                      >
                        {item.name}
                      </Link>
                      {item.subItems && (
                        <button 
                          onClick={() => toggleExpand(item.name)}
                          className="p-2 -mr-2 text-muted hover:text-primary transition-colors"
                        >
                          <ChevronRight 
                            size={16} 
                            className={`transition-transform duration-300 ${expandedItems.includes(item.name) ? 'rotate-90' : ''}`} 
                          />
                        </button>
                      )}
                      {!item.subItems && (
                        <ChevronRight size={16} className="text-muted" />
                      )}
                    </div>
                    {item.subItems && (
                      <AnimatePresence>
                        {expandedItems.includes(item.name) && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-border/5 rounded-lg mb-2"
                          >
                            {item.subItems.map(sub => (
                              <li key={sub.name}>
                                <Link
                                  to={sub.path}
                                  onClick={onClose}
                                  className="block py-3 px-4 text-xs font-bold text-muted hover:text-primary hover:bg-border/10 transition-colors uppercase tracking-wider"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                ))}
              </ul>

              <div className="p-6 grid grid-cols-2 gap-4">
                {user ? (
                  <Link 
                    to="/profile"
                    onClick={onClose}
                    className="flex flex-col items-center justify-center p-4 bg-border/10 rounded-xl gap-2 hover:bg-border/20 transition-colors"
                  >
                    <User size={24} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{user.isAdmin ? 'Admin' : 'Account'}</span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => { onClose(); openLogin(); }}
                    className="flex flex-col items-center justify-center p-4 bg-border/10 rounded-xl gap-2 hover:bg-border/20 transition-colors"
                  >
                    <User size={24} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sign In</span>
                  </button>
                )}
                {user?.isAdmin ? (
                  <Link 
                    to="/admin" 
                    onClick={onClose}
                    className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-xl gap-2 hover:bg-primary/20 transition-colors"
                  >
                    <ShoppingBag size={24} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                  </Link>
                ) : user ? (
                  <Link 
                    to="/pages/rewards" 
                    onClick={onClose}
                    className="flex flex-col items-center justify-center p-4 bg-border/10 rounded-xl gap-2 hover:bg-border/20 transition-colors"
                  >
                    <Star size={24} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Rewards</span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => {
                      onClose();
                      openLogin();
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-border/10 rounded-xl gap-2 hover:bg-border/20 transition-colors"
                  >
                    <Star size={24} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Rewards</span>
                  </button>
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
