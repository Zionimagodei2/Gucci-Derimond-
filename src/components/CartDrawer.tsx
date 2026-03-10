import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const freeShippingThreshold = 99;
  const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remaining = freeShippingThreshold - cartTotal;

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
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-tighter">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-border/50 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-6 bg-border/10 border-b border-border">
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
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
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
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold uppercase leading-tight">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-muted hover:text-primary">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
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
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest">Subtotal</span>
                  <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-muted uppercase tracking-widest text-center">
                  Taxes and shipping calculated at checkout
                </p>
                <button className="btn-primary w-full py-4 text-lg">
                  Checkout
                </button>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-[12px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
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
