import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: "Lighting", image: "https://picsum.photos/seed/cat-light/600/600", link: "/collections/lighting" },
  { name: "Exterior", image: "https://picsum.photos/seed/cat-ext/600/600", link: "/collections/exterior" },
  { name: "Interior", image: "https://picsum.photos/seed/cat-int/600/600", link: "/collections/interior" },
  { name: "Camping", image: "https://picsum.photos/seed/cat-camp/600/600", link: "/collections/camping-overland" },
  { name: "Wheels", image: "https://picsum.photos/seed/cat-wheel/600/600", link: "/collections/wheels" },
  { name: "Suspension", image: "https://picsum.photos/seed/cat-susp/600/600", link: "/collections/suspension" }
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
                referrerPolicy="no-referrer"
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
