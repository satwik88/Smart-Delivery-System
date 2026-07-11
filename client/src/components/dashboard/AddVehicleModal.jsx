import React, { useState } from 'react';
import { X, Truck, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const AddVehicleModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    license_plate: '',
    capacity_weight: '',
    type: 'TRUCK'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/fleet', {
        ...formData,
        capacity_weight: parseFloat(formData.capacity_weight)
      });
      setFormData({ name: '', license_plate: '', capacity_weight: '', type: 'TRUCK' });
      if (onAdded) onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-card-bg shadow-2xl rounded-2xl border border-border-main overflow-hidden"
        >
          <div className="p-6 border-b border-border-main flex justify-between items-center bg-surface-bg/50">
            <h2 className="text-xl font-black text-text-main flex items-center gap-2">
              <Truck size={20} className="text-brand-blue" />
              Add New Vehicle
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-surface-bg rounded-full transition-colors">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Vehicle Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Delivery Van 01"
                className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Hash size={14} /> License Plate
                </label>
                <input 
                  type="text"
                  value={formData.license_plate}
                  onChange={e => setFormData({...formData, license_plate: e.target.value})}
                  placeholder="e.g. XYZ-1234"
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Capacity (kg)</label>
                <input 
                  type="number"
                  value={formData.capacity_weight}
                  onChange={e => setFormData({...formData, capacity_weight: e.target.value})}
                  placeholder="e.g. 1000"
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Vehicle Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
              >
                <option value="TRUCK">Truck</option>
                <option value="VAN">Van</option>
                <option value="BIKE">Bike</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading || !formData.name || !formData.license_plate || !formData.capacity_weight}
              className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none mt-4"
            >
              {loading ? 'Creating...' : 'Create Vehicle'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddVehicleModal;
