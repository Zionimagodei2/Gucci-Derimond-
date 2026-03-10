import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const messages = [
  "FREE SHIPPING ON ORDERS OVER $99",
  "SHOP THE HOLIDAY SALE",
  "NEW FANG LIGHTS IN STOCK"
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-white relative h-10 flex items-center justify-center overflow-hidden">
      <div className="container-custom flex items-center justify-center w-full px-4 sm:px-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-center"
          >
            {messages[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
