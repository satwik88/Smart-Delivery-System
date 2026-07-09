import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Truck, User, Package, CheckCircle2, ChevronLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Leaflet Setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const warehouseIcon = new L.DivIcon({
  html: '<div class="w-8 h-8 bg-gray-900 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">W</div>',
  className: 'bg-transparent'
});

const truckIcon = new L.DivIcon({
  html: '<div class="w-6 h-6 bg-brand-blue rounded-full border-2 border-white shadow-md animate-pulse"></div>',
  className: 'bg-transparent'
});

const CustomerTrackingPage = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Real DB Data
  
  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/network/warehouses`);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNetwork();
  }, []);

  const fetchTracking = async (code) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/track/${code}`);
      setOrder(res.data);
    } catch (error) {
      setOrder(null);
      setError('Order not found. Please check your tracking code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      fetchTracking(trackingCode.trim());
    }
  };

  useEffect(() => {
    let interval;
    if (order && order.status !== 'delivered') {
      interval = setInterval(() => fetchTracking(order.orderId ? trackingCode : ''), 4000);
    }
    return () => clearInterval(interval);
  }, [order?.status, trackingCode]);

  const getStatusColor = (status) => {
    if (status === 'delivered') return 'text-green-500 bg-green-50';
    if (status === 'in_transit' || status === 'dispatched') return 'text-brand-blue bg-blue-50';
    return 'text-text-muted bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-[#F4F5FF] text-text-main font-sans flex flex-col selection:bg-brand-blue selection:text-white relative">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ChevronLeft size={20} className="text-text-muted" />
          <span className="font-bold text-text-muted">Back to Home</span>
        </Link>
        <Link to="/admin" className="text-sm font-bold text-brand-blue hover:underline">Admin Login</Link>
      </nav>

      <main className="flex-1 relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {/* Search Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="text-center max-w-2xl mx-auto w-full"
        >
          <div className="w-16 h-16 bg-card-bg rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-brand-blue border border-border-main">
            <Package size={32} />
          </div>
          <h1 className="text-4xl font-black mb-4">Track your package</h1>
          <p className="text-text-muted font-medium mb-8">Enter your tracking code to get live ETA and driver details.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="e.g. TRK-89231..."
                className="w-full bg-card-bg/60 backdrop-blur-md border border-white rounded-2xl pl-12 pr-4 py-4 text-text-main shadow-xl shadow-brand-blue/5 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-card-bg transition-all text-lg font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={24} />
            </div>
            <button 
              type="submit" 
              className="bg-brand-blue hover:bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-blue/20 transition-all hover:-translate-y-0.5 whitespace-nowrap text-lg"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>
          {error && <p className="text-red-500 font-medium mt-4 bg-red-50 py-2 px-4 rounded-xl border border-red-100 inline-block">{error}</p>}
        </motion.div>

        {/* Tracking Results Area */}
        <AnimatePresence>
          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              
              {/* Left Col: Details & Map */}
              <div className="flex-1 flex flex-col gap-6">
                
                {/* Live Map Glass Card */}
                <div className="bg-card-bg/70 backdrop-blur-xl p-3 rounded-3xl shadow-xl shadow-brand-blue/5 border border-white h-[400px] overflow-hidden">
                  <MapContainer center={[28.6, 77.2]} zoom={10} style={{ height: '100%', width: '100%', borderRadius: '1.25rem' }} zoomControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    {order.source?.lat && <Marker position={[order.source.lat, order.source.lng]} icon={warehouseIcon}><Popup>Origin: {order.source.name}</Popup></Marker>}
                    {order.destination?.lat && <Marker position={[order.destination.lat, order.destination.lng]} icon={warehouseIcon}><Popup>Destination: {order.destination.name}</Popup></Marker>}
                    {/* Simulated driver position between source and dest */}
                    {order.source?.lat && order.destination?.lat && (
                      <>
                        <Polyline positions={[[order.source.lat, order.source.lng], [order.destination.lat, order.destination.lng]]} color="#2F44FF" weight={4} dashArray="5, 10" />
                        <Marker position={[
                          order.source.lat + (order.destination.lat - order.source.lat) * (order.progressPct / 100),
                          order.source.lng + (order.destination.lng - order.source.lng) * (order.progressPct / 100)
                        ]} icon={truckIcon}>
                          <Popup>Package Location</Popup>
                        </Marker>
                      </>
                    )}
                  </MapContainer>
                </div>

                {/* Driver & Vehicle Details */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-card-bg/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg shadow-gray-200/40 border border-white flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-text-muted">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-0.5">Your Driver</p>
                      <p className="font-bold text-text-main">{order.driverName || "Assigning..."}</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-card-bg/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg shadow-gray-200/40 border border-white flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-text-muted">
                      <Truck size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-0.5">Vehicle</p>
                      <p className="font-bold text-text-main">{order.vehicleName || "Unknown"}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Col: Timeline & Status */}
              <div className="w-full lg:w-[380px] flex flex-col gap-6">
                
                {/* Main Status Card */}
                <div className="bg-card-bg/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-brand-blue/5 border border-white">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Estimated Delivery</p>
                    <p className="text-3xl font-black text-text-main">{order.status === 'delivered' ? 'Delivered' : `~${Math.max(10, Math.round(order.totalDistance))} mins`}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-border-main">
                      <span className="text-sm font-semibold text-text-muted flex items-center gap-2"><MapPin size={16}/> From</span>
                      <span className="text-sm font-bold">{order.source?.name || "Warehouse"}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border-main">
                      <span className="text-sm font-semibold text-text-muted flex items-center gap-2"><MapPin size={16}/> To</span>
                      <span className="text-sm font-bold">{order.destination?.name || "Customer"}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-card-bg/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-brand-blue/5 border border-white flex-1">
                  <h3 className="font-bold text-lg mb-6">Order Timeline</h3>
                  <div className="relative pl-6 border-l-2 border-border-main space-y-8">
                    {order.taskSequence?.map((task, idx) => {
                      const isCompleted = idx < order.currentTaskIndex;
                      const isCurrent = idx === order.currentTaskIndex;
                      
                      return (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-brand-blue animate-pulse' : 'bg-gray-200'}`}>
                            {isCompleted && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${isCurrent ? 'text-brand-blue' : isCompleted ? 'text-text-main' : 'text-text-muted'}`}>{task}</p>
                            {isCurrent && <p className="text-xs font-semibold text-text-muted mt-1">In progress...</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CustomerTrackingPage;
