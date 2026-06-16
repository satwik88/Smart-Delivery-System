import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Truck, MapPin, Clock, Calendar, Moon, Sun } from 'lucide-react';
import MapCanvas from '../components/MapCanvas';
import StatusTimeline from '../components/StatusTimeline';

const CustomerTrackingPage = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data for the map background
  const [warehouses, setWarehouses] = useState([]);
  const [roads, setRoads] = useState([]);
  
  // Theme toggle (Native Light)
  const [theme, setTheme] = useState(localStorage.getItem('slrros_theme') || 'light');

  useEffect(() => {
    // Remove the invert hack for this page
    document.body.classList.remove('theme-inverted');
    
    // Use proper Tailwind dark mode
    if (theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    
    localStorage.setItem('slrros_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Fetch initial network data for the map
    const fetchNetwork = async () => {
      try {
        const [wRes, rRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/network/warehouses`),
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/network/roads`)
        ]);
        setWarehouses(wRes.data);
        setRoads(rRes.data);
      } catch (err) {
        console.error("Failed to load network data", err);
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
    } catch (err) {
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

  // Polling for live updates
  useEffect(() => {
    let interval;
    if (order && order.status !== 'delivered') {
      interval = setInterval(() => {
        fetchTracking(order.orderId ? trackingCode : '');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [order?.status, trackingCode]);

  // Derived stats
  const distanceLeft = order ? (order.totalDistance * (1 - order.progressPct / 100)).toFixed(1) : 0;
  // Simple ETA: 1 min per km + 10 min base padding
  const etaMinutes = order ? Math.round(distanceLeft * 1 + 10) : 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col items-center pb-12 relative transition-colors">
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-6 z-50">
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
          className="p-2.5 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:text-neon-blue dark:hover:text-neon-blue transition-colors rounded-full shadow-sm hover:shadow-md"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
      {/* 1. HERO SECTION */}
      <section className="w-full bg-blue-50 dark:bg-slate-800/50 border-b border-blue-100 dark:border-slate-800 py-16 px-4 flex flex-col items-center text-center shadow-sm relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 dark:from-neon-blue/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-6 text-neon-blue transition-colors">
            <Truck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Track your delivery</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Real-time location, status, and ETA for your package.</p>
          
          <form onSubmit={handleSearch} className="w-full max-w-[480px] mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Enter Tracking Code..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            </div>
            <button 
              type="submit" 
              className="bg-neon-blue hover:bg-neon-blue-dark text-white px-8 py-3.5 rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-colors whitespace-nowrap"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>
          {error && <p className="text-red-500 font-medium mt-4 bg-red-50 py-2 px-4 rounded-lg inline-block border border-red-100">{error}</p>}
        </div>
      </section>

      <main className="w-full max-w-5xl px-4 mt-8 flex flex-col gap-8">
        
        {/* 2. MAP + STATS ROW */}
        <section className="flex flex-col lg:flex-row gap-6">
          
          {/* MAP AREA */}
          <div className="flex-1 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-[350px] transition-colors">
            <MapCanvas 
              warehouses={warehouses}
              roads={roads}
              route={order ? order.route : null}
              progressPct={order ? order.progressPct : 0}
              sourceId={order?.source?.id || null}
              destId={order?.destination?.id || null}
            />
          </div>

          {/* STATS AREA */}
          <div className="w-full lg:w-[240px] flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start gap-4 h-[106px] transition-colors">
              <div className="p-2.5 bg-blue-50 dark:bg-slate-700 rounded-xl text-neon-blue">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Distance Left</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {order ? distanceLeft : '--'} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">km</span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start gap-4 h-[106px] transition-colors">
              <div className="p-2.5 bg-green-50 dark:bg-slate-700 rounded-xl text-accent-green">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Est. Arrival</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {order ? etaMinutes : '--'} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">min</span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start gap-4 h-[106px] transition-colors">
              <div className="p-2.5 bg-purple-50 dark:bg-slate-700 rounded-xl text-purple-500">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Vehicle</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {order ? order.vehicleName || 'Standard Truck' : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STATUS TIMELINE */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-8">Order Status</h3>
          <StatusTimeline currentStatus={order ? order.status : ''} />
        </section>

      </main>

      {/* 4. FOOTER */}
      <footer className="mt-16">
        <Link to="/admin" className="text-sm font-medium text-slate-400 hover:text-neon-blue transition-colors">
          Admin Login
        </Link>
      </footer>
      
    </div>
  );
};

export default CustomerTrackingPage;
