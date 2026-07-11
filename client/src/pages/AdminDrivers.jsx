import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Truck, Phone, Navigation } from 'lucide-react';
import AddDriverModal from '../components/dashboard/AddDriverModal';

const AdminDrivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 20;

  const fetchDrivers = async () => {
      try {
        const response = await api.get('/drivers');
        // The endpoint returns { drivers, vehicles }
        // For now, map the returned drivers to match the UI format
        const formatted = response.data.drivers.map((d, i) => ({
          id: `DRV-${d.id}`,
          name: d.username,
          status: d.driver_assignments?.[0]?.status === 'ACTIVE' ? 'On Delivery' : 'Available',
          rating: '4.8',
          vehicle: d.driver_assignments?.[0]?.vehicle?.name || 'Unassigned',
          phone: '+1 (555) 010-' + (1000 + i),
          deliveries: Math.floor(Math.random() * 500) + 50
        }));
        setDrivers(formatted);
      } catch (err) {
        console.error("Error fetching drivers:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filtered = drivers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusColor = (status) => {
    if (status === 'Available') return 'bg-green-100 text-green-700';
    if (status === 'On Delivery') return 'bg-brand-blue/10 text-brand-blue';
    return 'bg-gray-100 text-text-muted';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-text-main">Drivers ({drivers.length})</h1>
          <p className="text-text-muted font-medium">Manage fleet operators and availability.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search driver..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="bg-card-bg border border-border-main rounded-full pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          </div>
          <button className="bg-card-bg border border-border-main rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-surface-bg">
            <Filter size={16} /> Filters
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-blue text-white rounded-full px-5 py-2 text-sm font-bold hover:bg-brand-dark transition-colors shadow-md shadow-brand-blue/20"
          >
            + Add Driver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {paginated.map((driver, i) => (
          <motion.div 
            key={driver.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="premium-card p-6 flex flex-col gap-4 relative group"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-text-muted">
                {driver.name.charAt(0)}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(driver.status)}`}>
                {driver.status}
              </span>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-text-main">{driver.name}</h3>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{driver.id}</p>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <Star size={16} className="text-yellow-400 fill-yellow-400" /> {driver.rating} Rating
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <Truck size={16} className="text-brand-blue" /> {driver.vehicle}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <Phone size={16} className="text-text-muted" /> {driver.phone}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border-main flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Deliveries</p>
                <p className="font-black text-text-main">{driver.deliveries}</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors">
                <Navigation size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm font-semibold text-text-muted">
          Showing {(page-1)*itemsPerPage + 1} to {Math.min(page*itemsPerPage, filtered.length)} of {filtered.length} drivers
        </p>
        <div className="flex gap-2">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-full border border-border-main text-sm font-bold disabled:opacity-50 hover:bg-surface-bg"
          >
            Prev
          </button>
          <button 
            disabled={page * itemsPerPage >= filtered.length} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-full border border-border-main text-sm font-bold disabled:opacity-50 hover:bg-surface-bg"
          >
            Next
          </button>
        </div>
      </div>

      <AddDriverModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={() => fetchDrivers()} 
      />
    </div>
  );
};

export default AdminDrivers;
