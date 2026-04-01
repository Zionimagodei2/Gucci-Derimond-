import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { 
    name: 'ACCESSORIES', 
    path: '/collections/accessories',
    subItems: [
      { name: 'All Accessories', path: '/collections/accessories' },
      { name: 'Velcro Bags', path: '/collections/velcro-bag' },
      { name: 'Camper Storage', path: '/collections/camper-storage' },
    ],
    featuredImages: [
      "https://toyotapowered.com/cdn/shop/files/King_Plus2in_LT_Spec_Bypasses_Main.jpg?v=1762298591",
      "https://toyotapowered.com/cdn/shop/files/DirtKing_4Runner_LT_Kit_Side.jpg?v=1762298581",
      "https://toyotapowered.com/cdn/shop/files/center-console-usb-12v-power-panel-billet-aluminum-replaces-ashtray-1996-2002-4runnerteq-offroad-690935.jpg?v=1759978309&width=1365"
    ]
  },
  { 
    name: 'EXTERIOR', 
    path: '/collections/exterior',
    subItems: [
      { name: 'Vehicle Decals', path: '/collections/vehicle-decals' },
      { name: 'Replacement Parts', path: '/collections/replacement-part' },
    ],
    featuredImages: [
      "https://toyotapowered.com/cdn/shop/files/1.4IDx1-1.4ODFenderWashersMain.jpg?v=1762298566",
      "https://toyotapowered.com/cdn/shop/files/IMG_2202_423acb9e-23a8-46dd-a047-b44d1ec31263.jpg?v=1762277750",
      "https://toyotapowered.com/cdn/shop/files/IMG_2662.jpg?v=1762277746"
    ]
  },
  { 
    name: 'WHEELS', 
    path: '/collections/wheels',
    subItems: [
      { name: 'All Wheels', path: '/collections/wheels' },
      { name: 'Truck, SUV, & Jeep Wheels', path: '/collections/truck-suv-jeep-wheels' },
    ],
    featuredImages: [
      "https://toyotapowered.com/cdn/shop/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073",
      "https://toyotapowered.com/cdn/shop/files/atlas_20satin_20black_206lug.png?v=1762265387",
      "https://toyotapowered.com/cdn/shop/files/venture_20satin_20bronze_206lug.png?v=1762265386"
    ]
  },
  { 
    name: 'CAMPING & OVERLAND', 
    path: '/collections/camping-overland',
    subItems: [
      { name: 'Rooftop Tents', path: '/collections/rooftop-tent' },
    ],
    featuredImages: [
      "https://toyotapowered.com/cdn/shop/files/RX-1G122.jpg?v=1762346078",
      "https://toyotapowered.com/cdn/shop/files/RX-1W12.jpg?v=1762346078",
      "https://toyotapowered.com/cdn/shop/files/BLACK1GALLONWATER1.jpg?v=1762346080"
    ]
  },
  { 
    name: 'APPAREL & PRINT', 
    path: '/collections/print-material',
    subItems: [
      { name: 'Print Material', path: '/collections/print-material' },
    ],
    featuredImages: [
      "https://toyotapowered.com/cdn/shop/files/Studio-Projecthoodieback.png?v=1762130459",
      "https://toyotapowered.com/cdn/shop/files/DirtKing_Black_Rado_Hoodie_Main.jpg?v=1762298592",
      "https://toyotapowered.com/cdn/shop/files/dirt-king-heather-grey-zip-up-hoodie-main.jpg?v=1762298555"
    ]
  },
  { name: 'SALE', path: '/collections/sale', color: 'text-primary' },
  { name: 'BLOG', path: '/blogs/news' },
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
                className={`relative h-full text-[13px] font-bold uppercase tracking-[0.08em] hover:text-primary transition-colors flex items-center gap-1 ${item.color || 'text-dark'}`}
              >
                {item.name}
                {item.subItems && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                {/* Simple underline on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
              
              <AnimatePresence>
                {item.subItems && hoveredItem === item.name && (
                  <motion.div
                    key={item.name}
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
                          {(item.featuredImages || []).map((imgSrc, i) => (
                            <div key={i} className="relative aspect-video overflow-hidden group/img">
                              <img 
                                src={imgSrc} 
                                alt="Featured" 
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
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
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
