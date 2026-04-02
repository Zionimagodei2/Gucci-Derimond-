import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoModal from './VideoModal';

const slides = [
  {
    image: "https://toyotapowered.com/cdn/shop/files/Main.jpg?v=1704772527&width=3333",
    title: "BUILT FOR ADVENTURE",
    subtitle: "Overland Gear & Camping Essentials",
    cta: "EXPLORE GEAR",
    link: "/collections/camping-overland",
    accent: "text-primary"
  },
  {
    image: "https://toyotapowered.com/cdn/shop/files/image-asset.jpg?v=1702537917&width=1920",
    title: "UPGRADE YOUR RIDE",
    subtitle: "Premium Wheels & Accessories",
    cta: "SHOP WHEELS",
    link: "/collections/wheels",
    accent: "text-white"
  },
  {
    image: "https://toyotapowered.com/cdn/shop/files/IMG_7804111.jpg?v=1699552631&width=2667",
    title: "ORGANIZE YOUR GEAR",
    subtitle: "Modular Velcro Panels & Storage",
    cta: "SHOP STORAGE",
    link: "/collections/accessories",
    accent: "text-primary"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section 
      className="relative h-[70vh] md:h-[90vh] overflow-hidden bg-dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 transition-transform duration-[10000ms] ease-linear scale-110"
          >
            <img 
              src={slides[current].image} 
              alt={slides[current].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>
          
          <div className="relative h-full container-custom flex flex-col items-start justify-center text-left text-white">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="text-primary text-sm md:text-base font-black uppercase tracking-[0.4em] mb-6 block">
                Marco Tac Lifestyle
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] uppercase">
                {slides[current].title}
              </h2>
              <p className="text-lg md:text-2xl mb-10 font-medium text-crossed max-w-xl">
                {slides[current].subtitle}
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to={slides[current].link} className="btn-primary px-12 py-4 text-lg">
                  {slides[current].cta}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        {slides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className="group relative h-1 w-12 bg-white/20 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-primary transition-all duration-300 ${current === idx ? 'w-full' : 'w-0'}`} />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors hidden lg:block"
      >
        <ChevronLeft size={64} strokeWidth={1} />
      </button>
      <button 
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors hidden lg:block"
      >
        <ChevronRight size={64} strokeWidth={1} />
      </button>
    </section>
  );
}
