import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoModal from './VideoModal';

const slides = [
  {
    image: "https://picsum.photos/seed/hero1/1920/1080",
    title: "THE NEXT GEN IS HERE",
    subtitle: "2024+ Tacoma Mods & Accessories",
    cta: "SHOP 4TH GEN",
    link: "/collections/4th-gen-tacoma",
    accent: "text-primary"
  },
  {
    image: "https://picsum.photos/seed/hero2/1920/1080",
    title: "LIGHT UP THE TRAIL",
    subtitle: "Premium LED Lighting Solutions",
    cta: "SHOP LIGHTING",
    link: "/collections/lighting",
    accent: "text-white"
  },
  {
    image: "https://picsum.photos/seed/hero3/1920/1080",
    title: "BUILT FOR ADVENTURE",
    subtitle: "Overland Gear & Camping Essentials",
    cta: "EXPLORE GEAR",
    link: "/collections/camping-overland",
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
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear scale-110"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
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
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="flex items-center gap-3 font-black uppercase tracking-widest hover:text-primary transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
                    <Play size={20} className="fill-current ml-1" />
                  </div>
                  Watch Build
                </button>
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
