import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const generations = [
  { name: "4th Gen", years: "2024-2026", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Rav4_PillarDecals_Mockup_AllBlack.png?v=1773156102", link: "/collections/4th-gen-tacoma", color: "from-primary/80" },
  { name: "3rd Gen", years: "2016-2023", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/57e3bfa1-7c73-4d7f-9a92-a0e225543091.webp?v=1773697888", link: "/collections/3rd-gen-tacoma", color: "from-dark/80" },
  { name: "2nd Gen", years: "2005-2015", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/b876c9af-08e8-4764-b9ee-b8b1b6bae484.jpg?v=1773696933", link: "/collections/2nd-gen-tacoma", color: "from-dark/80" },
  { name: "1st Gen", years: "1996-2004", image: "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/IMG_3211.png?v=1772760979", link: "/collections/1st-gen-tacoma", color: "from-dark/80" }
];

export default function ShopByGeneration() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-primary text-[12px] font-black uppercase tracking-[0.3em] mb-4 block">Tailored for your truck</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Shop By Generation</h2>
          </div>
          <Link to="/collections/all" className="group flex items-center gap-3 font-black uppercase tracking-widest text-sm hover:text-primary transition-colors">
            View All Parts <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {generations.map((gen) => (
            <Link 
              key={gen.name} 
              to={gen.link}
              className="group relative aspect-[4/5] overflow-hidden bg-dark"
            >
              <img 
                src={gen.image} 
                alt={gen.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${gen.color} to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500`} />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  {gen.years}
                </span>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">
                  {gen.name}
                </h3>
                <div className="w-12 h-1 bg-white group-hover:w-full transition-all duration-500" />
              </div>
              
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
