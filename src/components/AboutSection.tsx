import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-dark text-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://cdn.shopify.com/s/files/1/0635/8276/5242/files/5X8A2262.jpg?v=1772859284" 
                alt="Tacoma on trail" 
                className="w-full h-full object-cover"
                
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary p-10 hidden md:flex flex-col justify-center">
              <span className="text-5xl font-black mb-2">10+</span>
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">Years of Off-Road Excellence</p>
            </div>
          </div>
          
          <div>
            <span className="text-primary text-[12px] font-black uppercase tracking-[0.3em] mb-6 block">Our Story</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-none">
              Built by Enthusiasts,<br />For Enthusiasts.
            </h2>
            <p className="text-crossed text-lg mb-10 leading-relaxed">
              Marco Tac Life started in a small garage with a single goal: to build the ultimate Tacoma. Today, we are the #1 source for premium mods and accessories, serving a community of thousands who share our passion for the dirt.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-primary" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight mb-1">Trail Tested</h4>
                  <p className="text-xs text-crossed">Every part we sell is tested on our own builds.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Truck className="text-primary" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight mb-1">Fast Shipping</h4>
                  <p className="text-xs text-crossed">Most orders ship within 24 hours from our warehouse.</p>
                </div>
              </div>
            </div>
            
            <Link to="/pages/about-us" className="btn-primary inline-flex items-center gap-3 px-10">
              Read Our Full Story <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
