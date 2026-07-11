import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { Truck, Navigation, Settings, Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import VehicleDetailsDrawer from '../components/dashboard/VehicleDetailsDrawer';
import AddVehicleModal from '../components/dashboard/AddVehicleModal';

const FleetManagementModule = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await api.get('/fleet');
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filtered = vehicles.filter(v => 
    (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.license_plate || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (status === 'ACTIVE') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'IN_MAINTENANCE') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-text-main">Fleet Management</h1>
          <p className="text-text-muted font-medium">Monitor vehicles, drivers, and maintenance schedules.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search fleet..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card-bg border border-border-main rounded-full pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-blue text-white rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20"
          >
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-text-muted animate-pulse font-bold">Loading fleet data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((v, idx) => {
            const activeDriver = v.driver_assignments?.[0]?.user;
            
            return (
              <motion.div 
                key={v.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="premium-card p-6 flex flex-col hover:border-brand-blue/50 transition-colors cursor-pointer group relative overflow-hidden"
                onClick={() => { setSelectedVehicleId(v.id); setIsDrawerOpen(true); }}
              >
                {/* Decorator */}
                <div className="absolute -right-10 -top-10 text-surface-bg group-hover:text-brand-blue/5 transition-colors">
                  <Truck size={120} />
                </div>

                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-surface-bg border border-border-main rounded-2xl flex items-center justify-center text-text-muted group-hover:text-brand-blue transition-colors">
                    <Truck size={24} />
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-black rounded-full border uppercase tracking-wider ${getStatusColor(v.status)}`}>
                    {v.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-black text-text-main leading-tight">{v.name}</h3>
                  <p className="text-xs font-bold text-text-muted mb-4">{v.license_plate || 'No Plate'}</p>
                </div>

                <div className="relative z-10 mt-auto pt-4 border-t border-border-main space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-text-muted">Driver</span>
                    <span className="font-bold text-text-main">{activeDriver ? activeDriver.username : 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-text-muted">Type</span>
                    <span className="font-bold text-text-main uppercase">{v.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-text-muted">Capacity</span>
                    <span className="font-bold text-text-main">{v.capacity_weight}kg</span>
                  </div>
                </div>

                {v.status === 'IN_MAINTENANCE' && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500"></div>
                )}
                {v.status === 'ACTIVE' && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="p-10 text-center text-text-muted font-medium bg-card-bg border border-border-main rounded-2xl">
          No vehicles found matching your criteria.
        </div>
      )}

      <VehicleDetailsDrawer 
        isOpen={isDrawerOpen} 
        vehicleId={selectedVehicleId} 
        onClose={() => { setIsDrawerOpen(false); setSelectedVehicleId(null); }}
        onUpdate={() => fetchVehicles()}
      />
      <AddVehicleModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={() => fetchVehicles()}
      />
    </div>
  );
};

export default FleetManagementModule;
