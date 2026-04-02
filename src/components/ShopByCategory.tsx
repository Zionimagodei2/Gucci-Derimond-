import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: "Exterior", image: "https://toyotapowered.com/cdn/shop/files/thumbnail_IMG_3094.jpg?v=1703181295&width=1920", link: "/collections/exterior" },
  { name: "Wheels", image: "https://toyotapowered.com/cdn/shop/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073", link: "/collections/wheels" },
  { name: "Interior", image: "https://toyotapowered.com/cdn/shop/files/1st-gen-sequoia-01-07-center-console-dash-modular-accessory-mount-mamteq-offroad-391896.jpg?v=1759978314", link: "/collections/interior" },
  { name: "Rooftop Tents", image: "https://toyotapowered.com/cdn/shop/files/Aspen_lite_standard_3.png?v=1762354199", link: "/collections/rooftop-tent" },
  { name: "Camper Storage", image: "https://toyotapowered.com/cdn/shop/files/goose-gear-camper-system-midsize-truck-6ft-bed-passenger-side-front-sink-and-storage-utility-module-341011.jpg?v=1762444856", link: "/collections/camper-storage" },
  { name: "Vehicle Decals", image: "https://toyotapowered.com/cdn/shop/files/1996-2002_4Runner_Door_Pillar_Decals_Black_with_Heritage_Topo.jpg?v=1771959503", link: "/collections/vehicle-decals" }
];

export default function ShopByCategory() {
  return (
    <section className="py-24 bg-border/5">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">Shop By Category</h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={cat.link}
              className="group flex flex-col items-center"
            >
              <div className="w-full aspect-square overflow-hidden bg-dark mb-4 relative rounded-xl shadow-lg border border-border/50">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <h3 className="text-white text-xs md:text-sm font-black uppercase tracking-widest drop-shadow-md">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
