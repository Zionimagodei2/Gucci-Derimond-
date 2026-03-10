import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Pin as Pinterest, MapPin, Phone, Mail, ChevronRight, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-24 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          {/* Column 1: Brand (4 cols) */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white group-hover:fill-primary transition-colors duration-300">
                  <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="8" />
                  <path d="M50 5 L50 50 L90 75 M50 50 L10 75" fill="none" stroke="currentColor" strokeWidth="8" />
                  <path d="M30 35 L50 45 L70 35 L70 55 L50 65 L30 55 Z" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight uppercase">MarcoTacLife</span>
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">Superstore</span>
              </div>
            </Link>
            <p className="text-crossed text-sm leading-relaxed mb-8 max-w-sm">
              The #1 source for Toyota Tacoma mods, parts, and accessories. Enthusiast-run and trail-tested. We live for the dirt.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-crossed">
                <MapPin size={18} className="text-primary" />
                <span>123 Offroad Way, Adventure City, ST 12345</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-crossed">
                <Phone size={18} className="text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-crossed">
                <Mail size={18} className="text-primary" />
                <span>support@marcotaclife.com</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/james_yotas7?igsh=MW9jd2tzc2RwYWhtcg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@yota.offroad_?_r=1&_t=ZP-94QpuL889K2" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-2">Shop</h4>
            <ul className="space-y-4 text-sm text-crossed">
              {[
                { name: '4th Gen Tacoma', path: '/collections/4th-gen-tacoma' },
                { name: '3rd Gen Tacoma', path: '/collections/3rd-gen-tacoma' },
                { name: '2nd Gen Tacoma', path: '/collections/2nd-gen-tacoma' },
                { name: 'Exterior', path: '/collections/exterior' },
                { name: 'Interior', path: '/collections/interior' },
                { name: 'Lighting', path: '/collections/lighting' },
                { name: 'Camping', path: '/collections/camping-overland' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-primary hover:translate-x-1 transition-all inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Info (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-2">Info</h4>
            <ul className="space-y-4 text-sm text-crossed">
              {[
                { name: 'About Us', path: '/pages/about-us' },
                { name: 'Marco Points', path: '/pages/rewards' },
                { name: 'Blog', path: '/pages/blog' },
                { name: 'Contact Us', path: '/pages/contact-us' },
                { name: 'Dealer Program', path: '/pages/dealer-program' },
                { name: 'FAQ', path: '/pages/faq' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-primary hover:translate-x-1 transition-all inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-2">Newsletter</h4>
            <p className="text-sm text-crossed mb-6 leading-relaxed">
              Join our mailing list for exclusive offers, build guides, and new product drops.
            </p>
            <form className="relative" onSubmit={(e) => { e.preventDefault(); alert('Thanks for joining the crew!'); }}>
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary px-6 text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-colors">
                Join
              </button>
            </form>
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Star size={20} className="text-primary fill-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Earn Marco Points</p>
                  <Link to="/pages/rewards" className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                    Learn More <ChevronRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
            <p className="text-[11px] text-crossed font-medium">
              © 2025 Marco Tac Life. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[10px] text-crossed uppercase font-bold tracking-widest">
              <Link to="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/policies/shipping" className="hover:text-white transition-colors">Shipping</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4 opacity-40 grayscale hover:opacity-100 transition-opacity">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" referrerPolicy="no-referrer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" className="h-4 invert" referrerPolicy="no-referrer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" alt="Google Pay" className="h-4" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
