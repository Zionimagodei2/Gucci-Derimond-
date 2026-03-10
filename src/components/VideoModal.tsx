import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl aspect-video bg-black overflow-hidden shadow-2xl rounded-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-8 animate-pulse">
                <Play size={40} className="fill-white ml-2" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                Watch the Build
              </h2>
              <p className="text-crossed text-lg max-w-2xl mx-auto leading-relaxed mb-12">
                See how we transformed this stock Tacoma into a trail-ready beast. From suspension to lighting, we cover every step of the process.
              </p>
              <div className="flex gap-6">
                <button className="btn-primary px-12 py-4 text-lg">
                  Watch on YouTube
                </button>
                <button onClick={onClose} className="border border-white/20 px-12 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-dark transition-all">
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
