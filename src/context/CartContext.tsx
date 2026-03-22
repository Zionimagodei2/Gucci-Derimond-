import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem, openCart?: boolean) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  cartTotal: number;
  cartCount: number;
  pointsDiscount: number;
  appliedPoints: number;
  applyPoints: (points: number) => void;
  checkout: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [appliedPoints, setAppliedPoints] = useState(0);
  const { addPoints, removePoints } = useAuth();

  const addToCart = (item: CartItem, openCart = true) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const qtyToAdd = item.quantity || 1;
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i);
      }
      return [...prev, { ...item, quantity: qtyToAdd }];
    });
    
    // Reward 10 points for adding an item to the cart
    addPoints(10);
    
    if (openCart) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) => prev.map((i) => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  const applyPoints = (points: number) => {
    // 100 points = $1
    const discount = points / 100;
    setPointsDiscount(discount);
    setAppliedPoints(points);
  };

  const checkout = () => {
    // Remove applied points
    if (appliedPoints > 0) {
      removePoints(appliedPoints);
    }

    // Reward 1 point for every $1 spent
    const finalTotal = Math.max(0, cartTotal - pointsDiscount);
    const pointsEarned = Math.floor(finalTotal);
    if (pointsEarned > 0) {
      addPoints(pointsEarned);
    }
    setCartItems([]);
    setPointsDiscount(0);
    setAppliedPoints(0);
    setIsCartOpen(false);
    return pointsEarned;
  };

  return (
    <CartContext.Provider value={{ 
      isCartOpen, 
      setIsCartOpen, 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      cartTotal,
      cartCount,
      pointsDiscount,
      appliedPoints,
      applyPoints,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
