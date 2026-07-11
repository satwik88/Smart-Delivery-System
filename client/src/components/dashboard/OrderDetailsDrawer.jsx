import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, CheckCircle, Package, Key, ScanLine, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const OrderDetailsDrawer = ({ orderId, isOpen, onClose, onVerified }) => {
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [assigningVehicle, setAssigningVehicle] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
      fetchVehicles();
    }
  }, [isOpen, orderId]);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/fleet');
      setVehicles(res.data || []);
    } catch (err) {
      console.error("Error fetching vehicles", err);
    }
  };

  const handleAssignVehicle = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) return;
    setAssigningVehicle(true);
    try {
      await api.put(`/orders/${orderId}`, { vehicle_id: parseInt(selectedVehicleId) });
      setSelectedVehicleId('');
      fetchOrderDetails();
      if (onVerified) onVerified();
    } catch (err) {
      alert("Failed to assign vehicle");
    } finally {
      setAssigningVehicle(false);
    }
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const [orderRes, timelineRes] = await Promise.all([
        api.get(`/orders/${orderId}`),
        api.get(`/orders/${orderId}/timeline`)
      ]);
      setOrder(orderRes.data);
      setTimeline(timelineRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      await api.post(`/orders/${orderId}/verify`, { otp });
      alert("Order Verified & Delivered!");
      fetchOrderDetails();
      if (onVerified) onVerified();
    } catch (err) {
      alert(err.response?.data?.error || "Verification failed");
    } finally {
      setVerifying(false);
      setOtp('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-card-bg h-full shadow-2xl border-l border-border-main flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-border-main flex justify-between items-center bg-surface-bg/50">
            <div>
              <h2 className="text-xl font-black text-text-main">Order #{orderId}</h2>
              {order && <p className="text-sm font-bold text-brand-blue">{order.tracking_code}</p>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface-bg rounded-full transition-colors">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {loading ? (
              <div className="text-center text-text-muted animate-pulse font-bold mt-10">Loading details...</div>
            ) : order ? (
              <>
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'in_transit' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-text-muted">
                    {order.priority} PRIORITY
                  </span>
                </div>

                {/* OTP Verification Box */}
                {order.status !== 'delivered' && (
                  <div className="bg-brand-blue/5 border border-brand-blue/20 p-5 rounded-2xl">
                    <h3 className="text-sm font-black text-brand-blue flex items-center gap-2 mb-3">
                      <Key size={16} /> Delivery Verification
                    </h3>
                    <p className="text-xs font-medium text-text-muted mb-4">
                      Enter the 6-digit OTP provided by the customer to mark this order as delivered.
                    </p>
                    <form onSubmit={handleVerify} className="flex gap-2">
                      <input 
                        type="text" maxLength="6" placeholder="000000"
                        value={otp} onChange={e => setOtp(e.target.value)}
                        className="flex-1 bg-surface-bg border border-border-main rounded-xl px-4 py-2 font-mono text-center tracking-[0.5em] text-text-main focus:ring-2 focus:ring-brand-blue focus:outline-none"
                      />
                      <button type="submit" disabled={verifying || otp.length !== 6} className="bg-brand-blue text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50">
                        Verify
                      </button>
                    </form>
                    <div className="mt-3 flex justify-center text-text-muted hover:text-text-main transition-colors">
                      <button type="button" className="text-xs font-bold flex items-center gap-1">
                        <ScanLine size={14} /> Scan QR Instead
                      </button>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Order Info</h3>
                  <div className="bg-surface-bg p-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Package size={16} className="text-gray-400" />
                      <span className="font-medium text-text-muted w-20">Customer:</span>
                      <span className="font-bold text-text-main">{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="font-medium text-text-muted w-20">Type:</span>
                      <span className="font-bold text-text-main">{order.order_type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Truck size={16} className="text-gray-400" />
                      <span className="font-medium text-text-muted w-20">Vehicle:</span>
                      <span className="font-bold text-text-main">{order.vehicle ? `${order.vehicle.name} (${order.vehicle.license_plate})` : 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                {/* Assignment Form */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Assign Vehicle</h3>
                  <div className="bg-surface-bg p-4 rounded-2xl">
                    <form onSubmit={handleAssignVehicle} className="flex gap-2">
                      <select
                        value={selectedVehicleId}
                        onChange={e => setSelectedVehicleId(e.target.value)}
                        className="flex-1 bg-card-bg border border-border-main rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main"
                      >
                        <option value="">Select a vehicle...</option>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({v.license_plate || 'No Plate'})</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={assigningVehicle || !selectedVehicleId}
                        className="bg-brand-blue text-white rounded-xl px-4 py-2 font-bold text-xs shadow-md shadow-brand-blue/20 hover:opacity-95 disabled:opacity-50"
                      >
                        {assigningVehicle ? 'Assigning...' : 'Assign'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-text-muted uppercase tracking-widest flex justify-between">
                    <span>Timeline</span>
                  </h3>
                  <div className="relative pl-3 border-l-2 border-border-main space-y-6">
                    {timeline.map((event, index) => (
                      <div key={event.id} className="relative">
                        <div className={`absolute -left-[17px] top-0.5 w-3 h-3 rounded-full border-2 border-card-bg ${index === timeline.length - 1 ? 'bg-brand-blue' : 'bg-gray-300'}`} />
                        <p className="text-sm font-bold text-text-main leading-none">{event.status.toUpperCase()}</p>
                        <p className="text-xs font-medium text-text-muted mt-1">{event.description}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-2">{new Date(event.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                    {timeline.length === 0 && <p className="text-sm text-text-muted">No events recorded.</p>}
                  </div>
                </div>

              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderDetailsDrawer;
