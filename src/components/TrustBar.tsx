import React from 'react';
import { Truck, Zap, Heart, ShieldCheck } from 'lucide-react';

const trustItems = [
  { icon: Truck, text: "Free Shipping" },
  { icon: Zap, text: "Ships Fast" },
  { icon: Heart, text: "Enthusiast Owned" },
  { icon: ShieldCheck, text: "Secure Checkout" }
];

export default function TrustBar() {
  return (
    <section className="bg-white border-b border-border py-8">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-border/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <item.icon size={24} />
              </div>
              <span className="text-[12px] uppercase font-bold tracking-widest">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
