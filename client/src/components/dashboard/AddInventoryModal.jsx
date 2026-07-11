import React, { useState, useEffect } from 'react';
import { X, Package, Hash, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const AddInventoryModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({ 
    warehouse_id: '',
    sku: '',
    name: '',
    description: '',
    quantity: '0',
    reorder_point: '10',
    cost_price: '0',
    selling_price: '0'
  });
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchWarehouses();
    }
  }, [isOpen]);

  const fetchWarehouses = async () => {
    try {
      // Re-use an existing route if possible. If not, fallback to 1 as default.
      // There isn't a direct /warehouses route built for UI dropdowns yet, but let's try.
      const res = await api.get('/inventory'); 
      // Extract unique warehouses from inventory items as a fallback if /warehouses doesn't exist
      const uniqueWH = [];
      const map = new Map();
      res.data.forEach(item => {
        if (item.warehouse && !map.has(item.warehouse.id)) {
          map.set(item.warehouse.id, true);
          uniqueWH.push(item.warehouse);
        }
      });
      setWarehouses(uniqueWH);
      if (uniqueWH.length > 0) {
        setFormData(prev => ({ ...prev, warehouse_id: uniqueWH[0].id.toString() }));
      } else {
        // Fallback to warehouse 1 if none found
        setFormData(prev => ({ ...prev, warehouse_id: '1' }));
      }
    } catch (err) {
      console.error("Failed to fetch warehouses", err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/inventory', formData);
      setFormData({ warehouse_id: warehouses[0]?.id?.toString() || '1', sku: '', name: '', description: '', quantity: '0', reorder_point: '10', cost_price: '0', selling_price: '0' });
      if (onAdded) onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add inventory item");
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
          className="relative w-full max-w-lg bg-card-bg shadow-2xl rounded-2xl border border-border-main overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="p-6 border-b border-border-main flex justify-between items-center bg-surface-bg/50">
            <h2 className="text-xl font-black text-text-main flex items-center gap-2">
              <Package size={20} className="text-brand-blue" />
              Add New Item
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-surface-bg rounded-full transition-colors">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Hash size={14} /> SKU
                </label>
                <input 
                  type="text"
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  placeholder="e.g. WH-1234"
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Item Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Premium Box"
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Warehouse ID (Fallback 1)</label>
              <input 
                type="number"
                value={formData.warehouse_id}
                onChange={e => setFormData({...formData, warehouse_id: e.target.value})}
                className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Initial Quantity</label>
                <input 
                  type="number"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Reorder Point</label>
                <input 
                  type="number"
                  value={formData.reorder_point}
                  onChange={e => setFormData({...formData, reorder_point: e.target.value})}
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                  <DollarSign size={14} /> Cost Price
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={e => setFormData({...formData, cost_price: e.target.value})}
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                  <DollarSign size={14} /> Selling Price
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.selling_price}
                  onChange={e => setFormData({...formData, selling_price: e.target.value})}
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !formData.sku || !formData.name || !formData.warehouse_id}
              className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none mt-6"
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddInventoryModal;
