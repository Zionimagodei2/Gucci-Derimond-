import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-24 bg-dark text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Mail size={32} className="text-primary" />
          </div>
          
          <span className="text-primary text-[12px] font-black uppercase tracking-[0.4em] mb-4 block">Join the inner circle</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">
            Get 10% Off Your First Order
          </h2>
          <p className="text-crossed text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Be the first to know about new product drops, exclusive sales, and expert build guides. Join 50,000+ Tacoma enthusiasts.
          </p>
          
          {isSubscribed ? (
            <div className="bg-white/5 border border-primary/20 p-12 rounded-sm max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
              <CheckCircle2 size={64} className="text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">You're in the crew!</h3>
              <p className="text-crossed text-sm uppercase tracking-widest font-bold">Check your inbox for your 10% off code.</p>
            </div>
          ) : (
            <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-white/5 border border-white/10 px-8 py-5 text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button type="submit" className="btn-primary px-12 py-5 flex items-center justify-center gap-3 group">
                Subscribe <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          )}
          
          <p className="text-[10px] text-crossed uppercase tracking-[0.2em] font-bold">
            No spam. Just dirt. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
