import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const generations = [
  { name: "3rd Gen Tacoma", years: "2016-2023", image: "https://toyotapowered.com/cdn/shop/files/2a09c8a4d22859360816d64ba2836118.jpg?v=1705382194&width=1536", link: "/generation/3rd-gen-tacoma", color: "from-primary/80" },
  { name: "2nd Gen Tacoma", years: "2005-2015", image: "https://toyotapowered.com/cdn/shop/files/thumbnail_IMG_3094.jpg?v=1703181295&width=1920", link: "/generation/2nd-gen-tacoma", color: "from-dark/80" },
  { name: "1st Gen Tacoma", years: "1996-2004", image: "https://toyotapowered.com/cdn/shop/files/image-asset.jpg?v=1702537917&width=1920", link: "/generation/1st-gen-tacoma", color: "from-dark/80" },
  { name: "5th Gen 4Runner", years: "2010-2023", image: "https://toyotapowered.com/cdn/shop/files/ig_anbu-rnr_4runner_04.webp?v=1705382094&width=2000", link: "/generation/5th-gen-4runner", color: "from-primary/80" },
  { name: "4th Gen 4Runner", years: "2003-2009", image: "https://toyotapowered.com/cdn/shop/files/4th-gen-4runner-03-09-center-console-dash-modular-accessory-mount-mamteq-offroad-547318.jpg?v=1759978315&width=1320", link: "/generation/4th-gen-4runner", color: "from-dark/80" },
  { name: "3rd Gen 4Runner", years: "1996-2002", image: "https://toyotapowered.com/cdn/shop/files/DSC00217-212312311.jpg?v=1703203961&width=5000", link: "/generation/3rd-gen-4runner", color: "from-dark/80" },
  { name: "Lexus GX470", years: "2003-2009", image: "https://toyotapowered.com/cdn/shop/files/DSC4807_d1d066ec-dafb-4355-9be5-40c7900e94f4.jpg?v=1770433816&width=1254", link: "/generation/lexus-gx470", color: "from-primary/80" },
  { name: "FJ Cruiser", years: "2007-2014", image: "https://toyotapowered.com/cdn/shop/files/IMG_2202_423acb9e-23a8-46dd-a047-b44d1ec31263.jpg?v=1762277750&width=4032", link: "/generation/fj-cruiser", color: "from-dark/80" }
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
