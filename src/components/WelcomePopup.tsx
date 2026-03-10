import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail } from 'lucide-react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('welcome-popup-dismissed');
      if (!dismissed) {
        setIsOpen(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('welcome-popup-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
              <img 
                src="https://picsum.photos/seed/popup/800/1000" 
                alt="Welcome" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
              <h2 className="text-3xl font-bold uppercase tracking-tighter mb-4">
                GET 10% OFF
              </h2>
              <p className="text-muted mb-8 uppercase tracking-widest text-sm font-bold">
                YOUR FIRST ORDER
              </p>
              <p className="text-muted mb-8 text-sm leading-relaxed">
                Join the Marco Tac crew and get exclusive access to new drops, build guides, and members-only sales.
              </p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleDismiss(); }}>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full border border-border px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  required
                />
                <button type="submit" className="btn-primary w-full">
                  CLAIM MY DISCOUNT
                </button>
              </form>
              
              <button 
                onClick={handleDismiss}
                className="mt-6 text-[10px] uppercase tracking-widest font-bold text-muted hover:text-dark transition-colors"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
