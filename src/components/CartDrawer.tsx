import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Trash2, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal, pointsDiscount, appliedPoints, applyPoints } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pointsToUse, setPointsToUse] = useState('');
  
  const freeShippingThreshold = 99;
  const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remaining = freeShippingThreshold - cartTotal;
  
  const handleApplyPoints = () => {
    const points = parseInt(pointsToUse, 10);
    if (!isNaN(points) && points > 0 && user && user.points && points <= user.points) {
      applyPoints(points);
      setPointsToUse('');
    } else {
      alert("Invalid points amount.");
    }
  };

  const handleRemovePoints = () => {
    applyPoints(0);
  };

  const finalTotal = Math.max(0, cartTotal - pointsDiscount);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold uppercase tracking-tighter">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-border/50 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-4 sm:p-6 bg-border/10 border-b border-border shrink-0">
              <p className="text-sm font-bold uppercase tracking-widest mb-3">
                {remaining > 0 
                  ? `You're $${remaining.toFixed(2)} away from FREE shipping` 
                  : "You've unlocked FREE shipping!"}
              </p>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={64} className="text-border mb-4" />
                  <p className="text-muted mb-6">Your cart is currently empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="btn-primary w-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-border/20 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover"  />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold uppercase leading-tight">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-muted hover:text-primary">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-primary mt-1">${Number(item.price).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-border">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-border/50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-border/50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 pb-12 sm:pb-8 border-t border-border space-y-3 shrink-0 bg-white">
                
                {user && (
                  <div className="bg-border/10 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="flex items-center gap-2"><Star size={16} className="text-primary" /> Marco Points</span>
                      <span>{user.points || 0} Available</span>
                    </div>
                    {appliedPoints > 0 ? (
                      <div className="flex items-center justify-between bg-white border border-border rounded px-3 py-2 text-sm">
                        <span className="text-primary font-bold">{appliedPoints} points applied</span>
                        <button 
                          onClick={handleRemovePoints}
                          className="text-muted hover:text-dark transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={pointsToUse}
                          onChange={(e) => setPointsToUse(e.target.value)}
                          placeholder="Points to use"
                          className="w-full bg-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          min="0"
                          max={user.points || 0}
                        />
                        <button 
                          onClick={handleApplyPoints}
                          className="bg-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded hover:bg-black transition-colors whitespace-nowrap"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-muted">100 points = $1.00 discount</p>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  {pointsDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm text-primary font-bold">
                      <span className="uppercase tracking-widest">Points Discount</span>
                      <span>-${pointsDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-lg font-black border-t border-border pt-1">
                    <span className="uppercase tracking-widest">Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[10px] text-muted uppercase tracking-widest text-center">
                  Taxes and shipping calculated at checkout
                </p>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="btn-primary w-full py-3 text-base"
                >
                  Checkout
                </button>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-[12px] font-bold uppercase tracking-widest hover:text-primary transition-colors pb-2"
                >
                  View Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
