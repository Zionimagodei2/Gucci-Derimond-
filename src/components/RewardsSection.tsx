import React from 'react';
import { Star, Gift, Users, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RewardsSection() {
  const { user, openLogin, openJoin } = useAuth();

  return (
    <section className="py-24 bg-dark text-white overflow-hidden relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-primary text-[12px] font-black uppercase tracking-[0.3em] mb-6 block">Loyalty Program</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-none">
              Earn <span className="text-primary">Marco Points</span><br />
              On Every Purchase
            </h2>
            <p className="text-crossed text-lg mb-12 leading-relaxed max-w-xl">
              Join the Marco Tac Life rewards program and start earning points for every dollar spent. Redeem points for free gear and early access to new releases.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
              <div className="flex gap-5 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Gift size={24} className="text-primary group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight mb-1">Earn Points</h4>
                  <p className="text-xs text-crossed">1 Point for every $1 spent</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Star size={24} className="text-primary group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight mb-1">Exclusive Access</h4>
                  <p className="text-xs text-crossed">Early access to new products</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Trophy size={24} className="text-primary group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight mb-1">Tier Up</h4>
                  <p className="text-xs text-crossed">Unlock VIP perks as you spend</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Star size={24} className="text-primary group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight mb-1">Birthday Bonus</h4>
                  <p className="text-xs text-crossed">500 Points on your special day</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6">
              {user ? (
                <>
                  <button 
                    className="btn-primary px-10 py-4 flex items-center gap-3"
                    onClick={() => alert('Claim Rewards feature coming soon!')}
                  >
                    Claim Rewards <ArrowRight size={18} />
                  </button>
                  <div className="flex items-center gap-4 border border-white/20 px-8 py-4">
                    <Star size={20} className="text-primary" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted">Your Balance</p>
                      <p className="font-bold">{user.points || 0} Points</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={openJoin}
                    className="btn-primary px-10 py-4 flex items-center gap-3"
                  >
                    Join Now <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={openLogin}
                    className="border border-white/20 px-10 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-dark transition-all"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-white/5 rounded-full flex items-center justify-center p-12 animate-spin-slow">
              <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="aspect-square w-64 h-64 bg-primary rounded-full flex flex-col items-center justify-center text-center shadow-[0_0_100px_rgba(255,10,10,0.4)]">
                <Star size={64} className="fill-white mb-4" />
                <span className="text-6xl font-black tracking-tighter">500</span>
                <span className="text-[12px] font-black uppercase tracking-[0.4em]">Marco Points</span>
              </div>
            </div>
            
            {/* Floating Badges */}
            <div className="absolute top-0 right-0 bg-white text-dark p-4 rounded-sm shadow-xl animate-bounce">
              <p className="text-[10px] font-black uppercase tracking-widest">New Perk Unlocked</p>
            </div>
            <div className="absolute bottom-10 left-0 bg-primary text-white p-4 rounded-sm shadow-xl animate-pulse">
              <p className="text-[10px] font-black uppercase tracking-widest">VIP Status: Gold</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
