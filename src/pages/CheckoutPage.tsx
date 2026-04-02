import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, CreditCard, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartTotal, pointsDiscount, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const finalTotal = Math.max(0, cartTotal - pointsDiscount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        customer: shippingDetails,
        items: cartItems,
        total: finalTotal,
        pointsDiscount,
        userId: user?.id || null
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        throw new Error('Failed to submit order');
      }

      const data = await res.json();
      const pointsEarned = checkout(); // This will clear the cart and add points
      
      alert(`Order placed successfully! Order ID: ${data.orderId}\n\nYou earned ${pointsEarned} Marco Points.\n\nWe have received your order and will contact you shortly with payment instructions.`);
      navigate('/');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Your cart is empty</h2>
        <button onClick={() => navigate('/collections/all')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-border/10 py-4">
        <div className="container-custom flex items-center gap-2 text-[12px] uppercase font-bold tracking-widest text-muted">
          <button onClick={() => navigate('/')} className="hover:text-dark">Home</button>
          <ChevronRight size={12} />
          <span className="text-dark">Checkout</span>
        </div>
      </div>

      <div className="container-custom pt-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              
              {/* Shipping Information */}
              <div className="bg-white border border-border p-6 rounded-lg">
                <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">First Name</label>
                    <input required type="text" name="firstName" value={shippingDetails.firstName} onChange={handleInputChange} className="w-full border border-border p-3 rounded focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Last Name</label>
                    <input required type="text" name="lastName" value={shippingDetails.lastName} onChange={handleInputChange} className="w-full border border-border p-3 rounded focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Email Address</label>
                    <input required type="email" name="email" value={shippingDetails.email} onChange={handleInputChange} className="w-full border border-border p-3 rounded focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Street Address</label>
                    <input required type="text" name="address" value={shippingDetails.address} onChange={handleInputChange} className="w-full border border-border p-3 rounded focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">City</label>
                    <input required type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} className="w-full border border-border p-3 rounded focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">State / Province</label>
                    <input required type="text" name="state" value={shippingDetails.state} onChange={handleInputChange} className="w-full border border-border p-3 rounded focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">ZIP / Postal Code</label>
                    <input required type="text" name="zipCode" value={shippingDetails.zipCode} onChange={handleInputChange} className="w-full border border-border p-3 rounded focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Country</label>
                    <select name="country" value={shippingDetails.country} onChange={handleInputChange} className="w-full border border-border p-3 rounded focus:outline-none focus:border-primary transition-colors bg-white">
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexico</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white border border-border p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-primary" size={24} />
                  <h2 className="text-xl font-bold uppercase tracking-tight">Payment Method</h2>
                </div>
                
                <div className="bg-border/10 p-4 rounded border border-border flex items-start gap-4">
                  <ShieldCheck className="text-green-600 shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-sm mb-1">Manual Payment Processing</h3>
                    <p className="text-xs text-muted mb-4">
                      Submit your order details and we will contact you shortly with payment instructions.
                    </p>
                    <p className="text-[10px] text-muted mt-4">
                      * Your order will be processed and shipped once the payment is confirmed.
                    </p>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-border/10 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 rounded border border-border">
                    <div className="w-16 h-16 bg-border/20 shrink-0">
                      <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-sm font-bold leading-tight line-clamp-2">{item.name}</h3>
                      <div className="text-xs text-muted mt-1">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold text-sm flex items-center">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="font-bold">Calculated at next step</span>
                </div>
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span className="font-bold">Points Discount</span>
                    <span className="font-bold">-${pointsDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black border-t border-border pt-4 mt-4">
                  <span className="uppercase tracking-widest">Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Order'
                )}
              </button>
              <p className="text-[10px] text-muted text-center mt-4">
                By completing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
