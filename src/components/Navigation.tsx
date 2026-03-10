import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { 
    name: 'SHOP BY VEHICLE', 
    path: '/collections/shop-by-vehicle',
    subItems: [
      { name: '4th Gen (2024-2026)', path: '/collections/4th-gen-tacoma' },
      { name: '3rd Gen (2016-2023)', path: '/collections/3rd-gen-tacoma' },
      { name: '2nd Gen (2005-2015)', path: '/collections/2nd-gen-tacoma' },
      { name: '1st Gen (1996-2004)', path: '/collections/1st-gen-tacoma' },
    ]
  },
  { 
    name: 'EXTERIOR', 
    path: '/collections/exterior',
    subItems: [
      { name: 'Roof Racks', path: '/collections/roof-racks' },
      { name: 'Bed Racks', path: '/collections/bed-racks' },
      { name: 'Bumpers', path: '/collections/bumpers' },
      { name: 'Grilles', path: '/collections/grilles' },
      { name: 'Skid Plates', path: '/collections/skid-plates' },
      { name: 'Suspension', path: '/collections/suspension' },
      { name: 'Wheels', path: '/collections/wheels' },
      { name: 'Wheel Spacers', path: '/collections/wheel-spacers' },
    ]
  },
  { 
    name: 'INTERIOR', 
    path: '/collections/interior',
    subItems: [
      { name: 'Seat Covers', path: '/collections/seat-covers' },
      { name: 'Floor Mats', path: '/collections/floor-mats' },
      { name: 'Shift Knobs', path: '/collections/shift-knobs' },
      { name: 'Console Organizers', path: '/collections/console-organizers' },
      { name: 'Phone Mounts', path: '/collections/phone-mounts' },
    ]
  },
  { 
    name: 'LIGHTING', 
    path: '/collections/lighting',
    subItems: [
      { name: 'LED Light Bars', path: '/collections/led-light-bars' },
      { name: 'Ditch Lights', path: '/collections/ditch-lights' },
      { name: 'Fang Lights', path: '/collections/fang-lights' },
      { name: 'Tail Lights', path: '/collections/tail-lights' },
      { name: 'Fog Lights', path: '/collections/fog-lights' },
      { name: 'Headlights', path: '/collections/headlights' },
    ]
  },
  { 
    name: 'CAMPING & OVERLAND', 
    path: '/collections/camping-overland',
    subItems: [
      { name: 'Rooftop Tents', path: '/collections/rooftop-tents' },
      { name: 'Awnings', path: '/collections/awnings' },
      { name: 'Recovery Gear', path: '/collections/recovery-gear' },
      { name: 'Portable Power & Solar', path: '/collections/portable-power-solar' },
      { name: 'Coolers', path: '/collections/coolers' },
    ]
  },
  { 
    name: 'BRANDS', 
    path: '/collections/brands',
    subItems: [
      { name: 'Prinsu', path: '/collections/prinsu' },
      { name: 'Baja Designs', path: '/collections/baja-designs' },
      { name: 'Morimoto', path: '/collections/morimoto' },
      { name: 'ROAM', path: '/collections/roam' },
      { name: 'OVS', path: '/collections/ovs' },
      { name: 'ARB', path: '/collections/arb' },
    ]
  },
  { name: 'SALE', path: '/collections/sale', color: 'text-primary' },
  { name: 'MARCO TALK', path: '/blogs/news' },
];

export default function Navigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="bg-white border-b border-border hidden lg:block relative z-40">
      <div className="container-custom">
        <ul className="flex items-center justify-center gap-8 h-12">
          {navItems.map((item) => (
            <li 
              key={item.name} 
              className="group h-full flex items-center"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={item.path}
                className={`text-[13px] font-bold uppercase tracking-[0.08em] hover:text-primary transition-colors flex items-center gap-1 ${item.color || 'text-dark'}`}
              >
                {item.name}
                {item.subItems && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
              </Link>
              
              <AnimatePresence>
                {item.subItems && hoveredItem === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full bg-white border-b border-border shadow-xl pt-8 pb-12"
                  >
                    <div className="container-custom">
                      <div className="grid grid-cols-4 gap-8">
                        <div className="col-span-1">
                          <h4 className="text-[12px] font-black uppercase tracking-widest text-primary mb-6 border-b border-primary/20 pb-2">
                            {item.name}
                          </h4>
                          <ul className="space-y-3">
                            {item.subItems.map((sub) => (
                              <li key={sub.name}>
                                <Link 
                                  to={sub.path} 
                                  className="text-sm text-muted hover:text-dark hover:translate-x-1 transition-all inline-block font-medium"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                          {/* Featured images in mega menu */}
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="relative aspect-video overflow-hidden group/img">
                              <img 
                                src={`https://picsum.photos/seed/nav${item.name}${i}/600/400`} 
                                alt="Featured" 
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/40 transition-colors" />
                              <div className="absolute bottom-4 left-4">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest bg-primary px-2 py-1">
                                  Featured
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Simple underline on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
