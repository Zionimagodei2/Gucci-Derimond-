import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: "Accessories", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/modular-velcro-panel_a8ff721e-d9d3-4b59-aa16-d28b268675c1.jpg?v=1773785161", link: "/collections/accessories" },
  { name: "Wheels", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073", link: "/collections/wheels" },
  { name: "Rooftop Tents", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/fsr-evo-v2-rooftop-tent.webp?v=1772719766", link: "/collections/rooftop-tent" },
  { name: "Camper Storage", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/5X8A2262_66e62e7c-b268-48cc-b9f5-93d51cbeeb78.jpg?v=1772859285", link: "/collections/camper-storage" },
  { name: "Vehicle Decals", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Rav4_PillarDecals_Mockup_AllBlack.png?v=1773156102", link: "/collections/vehicle-decals" },
  { name: "Apparel", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/57e3bfa1-7c73-4d7f-9a92-a0e225543091.webp?v=1773697888", link: "/collections/print-material" }
];

export default function ShopByCategory() {
  return (
    <section className="py-24 bg-border/5">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">Shop By Category</h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={cat.link}
              className="group relative aspect-square overflow-hidden bg-dark"
            >
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-8 py-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <h3 className="text-sm font-black uppercase tracking-widest">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
