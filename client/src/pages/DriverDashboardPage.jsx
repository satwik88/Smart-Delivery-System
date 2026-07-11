import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, LogOut, CheckCircle2, Navigation, AlertCircle, Compass, Play, Square, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const DriverDashboardPage = () => {
  const [vehicle, setVehicle] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulatingOrderId, setSimulatingOrderId] = useState(null);
  const [simStep, setSimStep] = useState(0);
  const [otpModalOrderId, setOtpModalOrderId] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const simIntervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveVehicleAndOrders();
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  const fetchActiveVehicleAndOrders = async () => {
    try {
      const vehicleRes = await api.get('/drivers/mobile/active-vehicle');
      setVehicle(vehicleRes.data);
      if (vehicleRes.data) {
        const ordersRes = await api.get('/drivers/mobile/orders');
        setOrders(ordersRes.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error loading driver data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('driverToken');
    navigate('/driver/login');
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.put(`/drivers/mobile/orders/${orderId}/status`, { status: 'in_transit' });
      fetchActiveVehicleAndOrders();
    } catch (err) {
      alert("Error accepting delivery");
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await api.put(`/drivers/mobile/orders/${orderId}/reject`);
      fetchActiveVehicleAndOrders();
    } catch (err) {
      alert("Error rejecting delivery");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpValue) return;
    setErrorMsg('');
    try {
      await api.post(`/drivers/mobile/orders/${otpModalOrderId}/verify-otp`, { otp: otpValue });
      setOtpModalOrderId(null);
      setOtpValue('');
      fetchActiveVehicleAndOrders();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "OTP Verification failed");
    }
  };

  // Telemetry simulation
  const startTelemetrySimulation = (order) => {
    if (!vehicle) return;
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    
    setSimulatingOrderId(order.id);
    setSimStep(0);
    
    // Fallback coords (Delhi NCR general coordinates if warehouse pos is missing/0)
    const srcLat = order.source_warehouse?.pos_x || 28.58;
    const srcLng = order.source_warehouse?.pos_y || 77.30;
    const dstLat = order.dest_warehouse?.pos_x || 28.62;
    const dstLng = order.dest_warehouse?.pos_y || 77.38;

    const totalSteps = 10;
    
    simIntervalRef.current = setInterval(async () => {
      setSimStep(prevStep => {
        const nextStep = prevStep + 1;
        const progress = nextStep / totalSteps;
        const currentLat = srcLat + (dstLat - srcLat) * progress;
        const currentLng = srcLng + (dstLng - srcLng) * progress;

        // Push telemetry
        api.put(`/fleet/${vehicle.vehicle.id}/telemetry`, { lat: currentLat, lng: currentLng })
          .catch(e => console.error("Telemetry failed", e));

        if (nextStep >= totalSteps) {
          clearInterval(simIntervalRef.current);
          setSimulatingOrderId(null);
          alert("Simulation Complete! Vehicle has reached destination.");
          return 0;
        }
        return nextStep;
      });
    }, 2000);
  };

  const stopTelemetrySimulation = () => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    setSimulatingOrderId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6 text-text-main font-sans">
        <div className="flex flex-col items-center gap-4">
          <Truck className="text-brand-blue animate-bounce" size={48} />
          <p className="font-bold animate-pulse">Loading Driver Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg p-4 md:p-6 font-sans text-text-main relative pb-20">
      
      {/* Header */}
      <header className="flex justify-between items-center bg-card-bg/80 backdrop-blur border border-border-main p-4 rounded-2xl mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight">Driver Hub</h1>
            <p className="text-xs text-text-muted font-semibold">Ready for shipments</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        
        {/* Active Vehicle Info */}
        {!vehicle ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-6 border-l-4 border-l-yellow-500 flex flex-col items-center text-center gap-4 bg-yellow-500/5"
          >
            <AlertCircle className="text-yellow-500" size={36} />
            <div>
              <h3 className="font-black text-lg">No Vehicle Assigned</h3>
              <p className="text-sm text-text-muted font-medium mt-1">Please contact dispatch to assign you a vehicle before starting deliveries.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-5 border border-border-main bg-card-bg"
          >
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Active Vehicle</p>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl text-text-main leading-tight">{vehicle.vehicle.name}</h3>
                <p className="text-xs font-bold text-brand-blue mt-0.5">{vehicle.vehicle.license_plate}</p>
              </div>
              <span className="bg-green-100 border border-green-200 text-green-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                Active Assignment
              </span>
            </div>
          </motion.div>
        )}

        {/* Deliveries Section */}
        {vehicle && (
          <div className="space-y-4">
            <h2 className="font-black text-lg tracking-tight flex justify-between items-center">
              <span>My Shipments ({orders.length})</span>
              <button 
                onClick={fetchActiveVehicleAndOrders}
                className="text-xs text-brand-blue hover:underline font-bold"
              >
                Refresh
              </button>
            </h2>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-text-muted bg-card-bg border border-border-main rounded-2xl">
                  <CheckCircle2 size={36} className="mx-auto mb-2 text-gray-300" />
                  <p className="font-bold">All deliveries completed!</p>
                  <p className="text-xs mt-1">Wait here for dispatch orders.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <motion.div 
                    key={order.id} 
                    layout
                    className="premium-card p-5 border border-border-main bg-card-bg flex flex-col gap-4 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-brand-blue/10 border border-brand-blue/20 text-brand-blue px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                          {order.tracking_code}
                        </span>
                        <h3 className="font-black text-lg text-text-main mt-2">{order.customer_name}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.status === 'in_transit' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-surface-bg p-3 rounded-xl space-y-2 text-xs font-semibold text-text-muted">
                      <div className="flex justify-between">
                        <span>Pickup:</span>
                        <span className="text-text-main">{order.source_warehouse?.name || "Hub"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Address:</span>
                        <span className="text-text-main">{order.dest_warehouse?.name || "Client"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <span className="text-text-main uppercase">{order.priority}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {['placed', 'verified', 'dispatched'].includes(order.status) && (
                        <>
                          <button 
                            onClick={() => handleAcceptOrder(order.id)}
                            className="flex-1 bg-brand-blue text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-brand-blue/20 hover:opacity-90"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleRejectOrder(order.id)}
                            className="flex-1 bg-surface-bg border border-border-main text-text-main py-2.5 rounded-xl font-bold text-xs hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.status === 'in_transit' && (
                        <div className="w-full flex flex-col gap-2">
                          <div className="flex gap-2">
                            {simulatingOrderId === order.id ? (
                              <button 
                                onClick={stopTelemetrySimulation}
                                className="flex-1 bg-yellow-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                              >
                                <Square size={14} /> Stop Sim ({simStep * 10}%)
                              </button>
                            ) : (
                              <button 
                                onClick={() => startTelemetrySimulation(order)}
                                className="flex-1 bg-brand-blue text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-blue/20"
                              >
                                <Play size={14} /> Simulate Route
                              </button>
                            )}
                            <button 
                              onClick={() => setOtpModalOrderId(order.id)}
                              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-green-600/20"
                            >
                              <KeyRound size={14} /> Complete Delivery
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* OTP Modal */}
      <AnimatePresence>
        {otpModalOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOtpModalOrderId(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="premium-card p-6 w-full max-w-sm relative z-10 bg-card-bg"
            >
              <h3 className="font-black text-lg mb-2">Verify Customer OTP</h3>
              <p className="text-xs text-text-muted mb-4 font-semibold">Enter the code provided by the customer to confirm delivery.</p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input 
                  type="text" maxLength="6" placeholder="000000" required autoFocus
                  value={otpValue} onChange={e => setOtpValue(e.target.value)}
                  className="w-full bg-surface-bg border border-border-main rounded-xl p-3 text-center text-lg font-mono tracking-[0.5em] focus:ring-2 focus:ring-brand-blue outline-none"
                />
                {errorMsg && <p className="text-xs font-bold text-red-500 text-center">{errorMsg}</p>}
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-xs">Verify & Deliver</button>
                  <button type="button" onClick={() => setOtpModalOrderId(null)} className="flex-1 bg-surface-bg border border-border-main text-text-main py-2.5 rounded-xl font-bold text-xs">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverDashboardPage;
