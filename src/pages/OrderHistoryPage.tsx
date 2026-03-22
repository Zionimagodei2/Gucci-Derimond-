import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { ChevronRight, Package, ArrowLeft } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('Failed to fetch orders:', data);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-border/10 py-4">
        <div className="container-custom flex items-center gap-2 text-[12px] uppercase font-bold tracking-widest text-muted">
          <Link to="/" className="hover:text-dark">Home</Link>
          <ChevronRight size={12} />
          <Link to="/profile" className="hover:text-dark">Profile</Link>
          <ChevronRight size={12} />
          <span className="text-dark">Order History</span>
        </div>
      </div>

      <div className="container-custom pt-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="p-2 hover:bg-border/50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Order History</h1>
        </div>
        
        <div className="max-w-4xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={order.id} 
                  className="p-6 bg-background border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black uppercase tracking-tight">{order.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted">
                      {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • {order.items} item{order.items > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <span className="font-black text-lg">${Number(order.total).toFixed(2)}</span>
                    <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
              <Package size={48} className="mx-auto text-muted mb-6" />
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No Orders Yet</h2>
              <p className="text-muted font-medium mb-8">You haven't placed any orders yet.</p>
              <Link to="/collections/all" className="btn-primary px-8">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
