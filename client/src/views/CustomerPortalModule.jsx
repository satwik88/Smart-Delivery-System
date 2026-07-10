import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const CustomerPortalModule = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/customer/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const pastOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className="min-h-screen bg-surface-bg p-6 lg:p-10 font-sans text-text-main">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        <div className="flex justify-between items-center bg-card-bg p-6 rounded-2xl border border-border-main shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-text-main">My Deliveries</h1>
            <p className="text-text-muted font-medium text-sm mt-1">Track and manage your orders.</p>
          </div>
          <button 
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
            onClick={() => {
              localStorage.removeItem('customerToken');
              window.location.href = '/customer/login';
            }}
          >
            Log Out
          </button>
        </div>

        {loading ? (
          <div className="text-center font-bold text-text-muted p-10 animate-pulse">Loading orders...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h2 className="text-lg font-black uppercase tracking-wider text-text-muted">Active Deliveries</h2>
              
              {activeOrders.length === 0 ? (
                <div className="bg-card-bg border border-border-main rounded-2xl p-10 text-center text-text-muted font-medium">
                  No active deliveries at the moment.
                </div>
              ) : (
                <div className="grid gap-4">
                  {activeOrders.map(order => (
                    <motion.div 
                      key={order.id} 
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedOrder(order)}
                      className={`premium-card p-6 cursor-pointer border-2 transition-all ${selectedOrder?.id === order.id ? 'border-brand-blue shadow-lg shadow-brand-blue/10' : 'border-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm font-black text-brand-blue tracking-wider mb-1">#{order.tracking_code}</p>
                          <h3 className="font-bold text-text-main">Delivery for {order.customer_name}</h3>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-black uppercase tracking-wider">
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-text-muted font-medium">
                        <span className="flex items-center gap-2"><Clock size={16}/> Updated {new Date(order.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><MapPin size={16}/> En Route</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <h2 className="text-lg font-black uppercase tracking-wider text-text-muted mt-4">Past Orders</h2>
              <div className="grid gap-4">
                  {pastOrders.map(order => (
                    <div key={order.id} className="bg-card-bg border border-border-main rounded-2xl p-4 flex justify-between items-center opacity-80">
                      <div>
                        <p className="text-xs font-black text-text-muted">#{order.tracking_code}</p>
                        <p className="font-bold text-sm">Delivered on {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                  ))}
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-1">
               {selectedOrder ? (
                 <div className="bg-card-bg border border-border-main rounded-2xl p-6 shadow-xl sticky top-6">
                    <h3 className="font-black text-xl mb-4 text-text-main">Order Details</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Tracking Code</p>
                        <p className="font-bold">{selectedOrder.tracking_code}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Status</p>
                        <p className="font-bold capitalize text-brand-blue">{selectedOrder.status}</p>
                      </div>
                      {selectedOrder.delivery_notes && (
                        <div>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Notes</p>
                          <p className="text-sm">{selectedOrder.delivery_notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border-main">
                      <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Timeline</p>
                      <div className="space-y-4">
                        {selectedOrder.events?.map((evt, idx) => (
                          <div key={evt.id} className="flex gap-3 relative">
                            {idx !== selectedOrder.events.length - 1 && (
                              <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border-main -bottom-4"></div>
                            )}
                            <div className="w-5 h-5 rounded-full bg-brand-blue/20 border-2 border-brand-blue flex-shrink-0 z-10"></div>
                            <div className="-mt-1">
                              <p className="text-sm font-bold capitalize">{evt.status}</p>
                              <p className="text-xs text-text-muted">{evt.description}</p>
                              <p className="text-[10px] text-text-muted mt-0.5 font-medium">{new Date(evt.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        {(!selectedOrder.events || selectedOrder.events.length === 0) && (
                          <p className="text-sm text-text-muted font-medium">No updates yet.</p>
                        )}
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="bg-card-bg border border-border-main rounded-2xl p-10 text-center flex flex-col items-center justify-center text-text-muted sticky top-6">
                   <Package size={48} className="mb-4 opacity-50" />
                   <p className="font-bold">Select an order to view details.</p>
                 </div>
               )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPortalModule;
