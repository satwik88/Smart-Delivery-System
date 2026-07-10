import React, { useState, useEffect } from 'react';
import { X, Wrench, Navigation, Truck, Settings, MapPin, User, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const VehicleDetailsDrawer = ({ vehicleId, isOpen, onClose, onUpdate }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('overview'); // overview, maintenance, assignments
  const [newLog, setNewLog] = useState({ description: '', cost: '' });
  const [addingLog, setAddingLog] = useState(false);

  useEffect(() => {
    if (isOpen && vehicleId) {
      fetchVehicleDetails();
      setTab('overview');
    }
  }, [isOpen, vehicleId]);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/fleet/${vehicleId}`);
      setVehicle(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaintenance = async (e) => {
    e.preventDefault();
    setAddingLog(true);
    try {
      await api.post(`/fleet/${vehicleId}/maintenance`, newLog);
      setNewLog({ description: '', cost: '' });
      fetchVehicleDetails();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert("Failed to add log");
    } finally {
      setAddingLog(false);
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
          className="relative w-full max-w-lg bg-card-bg h-full shadow-2xl border-l border-border-main flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-border-main flex justify-between items-center bg-surface-bg/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
                <Truck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-text-main">{vehicle?.name || `Vehicle #${vehicleId}`}</h2>
                <p className="text-sm font-bold text-text-muted">{vehicle?.license_plate || 'No Plate'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface-bg rounded-full transition-colors">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-10 text-center text-text-muted animate-pulse font-bold">Loading...</div>
            ) : vehicle ? (
              <>
                {/* Tabs */}
                <div className="flex border-b border-border-main bg-surface-bg">
                  <button onClick={() => setTab('overview')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'overview' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-text-muted hover:text-text-main'}`}>Overview</button>
                  <button onClick={() => setTab('maintenance')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'maintenance' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-text-muted hover:text-text-main'}`}>Maintenance</button>
                  <button onClick={() => setTab('assignments')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'assignments' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-text-muted hover:text-text-main'}`}>Assignments</button>
                </div>

                <div className="p-6">
                  {tab === 'overview' && (
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="flex-1 bg-surface-bg p-4 rounded-2xl border border-border-main text-center">
                          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Status</p>
                          <p className={`mt-2 font-black text-sm uppercase ${vehicle.status === 'ACTIVE' ? 'text-green-500' : 'text-yellow-500'}`}>{vehicle.status.replace('_', ' ')}</p>
                        </div>
                        <div className="flex-1 bg-surface-bg p-4 rounded-2xl border border-border-main text-center">
                          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Type</p>
                          <p className="mt-2 font-black text-sm uppercase text-text-main">{vehicle.type}</p>
                        </div>
                      </div>

                      <div className="bg-surface-bg p-5 rounded-2xl border border-border-main space-y-4">
                        <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-2 flex items-center gap-2"><Settings size={16}/> Specifications</h3>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-text-muted">Capacity Weight</span>
                          <span className="font-bold text-text-main">{vehicle.capacity_weight} kg</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-text-muted">Fuel Efficiency</span>
                          <span className="font-bold text-text-main">{vehicle.fuel_efficiency ? `${vehicle.fuel_efficiency} km/l` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-text-muted">Total Distance</span>
                          <span className="font-bold text-text-main">{vehicle.total_distance} km</span>
                        </div>
                      </div>

                      <div className="bg-brand-blue/5 border border-brand-blue/20 p-5 rounded-2xl">
                        <h3 className="text-sm font-black text-brand-blue flex items-center gap-2 mb-2"><Navigation size={16}/> Live Telemetry</h3>
                        {vehicle.current_location_lat && vehicle.current_location_lng ? (
                          <div className="mt-4 bg-card-bg border border-border-main h-32 rounded-xl flex items-center justify-center relative overflow-hidden">
                            {/* Mock Map Background */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            <div className="relative flex flex-col items-center">
                              <MapPin className="text-brand-blue animate-bounce" size={32} />
                              <span className="text-xs font-bold font-mono mt-2 bg-surface-bg px-2 py-1 rounded">
                                {vehicle.current_location_lat.toFixed(4)}, {vehicle.current_location_lng.toFixed(4)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-text-muted">Telemetry inactive. GPS tracking not yet synced.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {tab === 'maintenance' && (
                    <div className="space-y-6">
                      <div className="bg-surface-bg p-5 rounded-2xl border border-border-main">
                        <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-4 flex items-center gap-2"><Wrench size={16}/> Add Service Record</h3>
                        <form onSubmit={handleAddMaintenance} className="space-y-3">
                          <input 
                            type="text" placeholder="Service description (e.g. Oil Change)" required
                            value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})}
                            className="w-full bg-card-bg border border-border-main rounded-xl px-4 py-2 text-sm text-text-main focus:ring-2 focus:ring-brand-blue outline-none"
                          />
                          <div className="flex gap-2">
                            <input 
                              type="number" placeholder="Cost ($)" required
                              value={newLog.cost} onChange={e => setNewLog({...newLog, cost: e.target.value})}
                              className="w-1/3 bg-card-bg border border-border-main rounded-xl px-4 py-2 text-sm text-text-main focus:ring-2 focus:ring-brand-blue outline-none"
                            />
                            <button type="submit" disabled={addingLog} className="flex-1 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                              {addingLog ? 'Saving...' : 'Log Service'}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Service History</h3>
                        {vehicle.maintenance_logs?.length > 0 ? vehicle.maintenance_logs.map(log => (
                          <div key={log.id} className="bg-card-bg border border-border-main p-4 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold text-text-main">{log.description}</p>
                              <p className="text-xs font-medium text-text-muted mt-1">{new Date(log.date).toLocaleDateString()}</p>
                            </div>
                            <span className="text-sm font-black text-brand-blue">${log.cost}</span>
                          </div>
                        )) : (
                          <p className="text-sm font-medium text-text-muted text-center py-4">No maintenance logs found.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {tab === 'assignments' && (
                    <div className="space-y-6">
                      <div className="bg-surface-bg p-5 rounded-2xl border border-border-main">
                        <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-4 flex items-center gap-2"><User size={16}/> Assignment History</h3>
                        <div className="space-y-3">
                          {vehicle.driver_assignments?.length > 0 ? vehicle.driver_assignments.map(assign => (
                            <div key={assign.id} className="flex items-center gap-3 p-3 bg-card-bg rounded-xl border border-border-main">
                              <div className="w-8 h-8 rounded-full bg-surface-bg flex items-center justify-center text-text-muted">
                                <User size={14}/>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-text-main">{assign.user?.username}</p>
                                <p className="text-xs text-text-muted">
                                  {new Date(assign.start_time).toLocaleString()} - {assign.end_time ? new Date(assign.end_time).toLocaleString() : 'Present'}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${assign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {assign.status}
                              </span>
                            </div>
                          )) : (
                            <p className="text-sm text-text-muted text-center py-4 font-medium">No assignment history.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VehicleDetailsDrawer;
