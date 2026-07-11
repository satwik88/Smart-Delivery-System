import React, { useState, useEffect } from 'react';
import { X, AlertCircle, PackagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const CreateOrderModal = ({ isOpen, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    budget: '',
    source_warehouse_id: '',
    dest_warehouse_id: '',
    priority: 'STANDARD',
    order_type: 'DELIVERY'
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/network/warehouses')
        .then(res => setWarehouses(res.data))
        .catch(err => console.error('Failed to load warehouses', err));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/orders', formData);
      setFormData({
        customer_name: '',
        customer_email: '',
        budget: '',
        source_warehouse_id: '',
        dest_warehouse_id: '',
        priority: 'STANDARD',
        order_type: 'DELIVERY'
      });
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-card-bg shadow-2xl rounded-2xl border border-border-main overflow-hidden"
        >
          <div className="p-6 border-b border-border-main flex justify-between items-center bg-surface-bg/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
                <PackagePlus size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-text-main">Create New Order</h2>
                <p className="text-xs font-medium text-text-muted mt-0.5">Enter delivery details to generate tracking.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} className="text-text-muted hover:text-text-main" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-main mb-1.5">Customer Name</label>
                <input 
                  required
                  type="text" 
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp" 
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none text-text-main"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-main mb-1.5">Customer Email (Optional)</label>
                <input 
                  type="email" 
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="e.g. acme@example.com (links to Customer Portal)" 
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none text-text-main"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-main mb-1.5">Expected Revenue / Budget ($)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0.00" 
                  className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none text-text-main"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-main mb-1.5">Origin Warehouse</label>
                  <select 
                    name="source_warehouse_id"
                    value={formData.source_warehouse_id}
                    onChange={handleChange}
                    className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none text-text-main"
                  >
                    <option value="">Select Origin...</option>
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-main mb-1.5">Destination Warehouse</label>
                  <select 
                    name="dest_warehouse_id"
                    value={formData.dest_warehouse_id}
                    onChange={handleChange}
                    className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none text-text-main"
                  >
                    <option value="">Select Destination...</option>
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-main mb-1.5">Priority</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none text-text-main"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="EXPRESS">Express</option>
                    <option value="SAME_DAY">Same Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-main mb-1.5">Order Type</label>
                  <select 
                    name="order_type"
                    value={formData.order_type}
                    onChange={handleChange}
                    className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none text-text-main"
                  >
                    <option value="DELIVERY">Delivery</option>
                    <option value="PICKUP">Pickup</option>
                    <option value="RETURN">Return</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border-main mt-6">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2.5 rounded-xl font-bold text-text-muted hover:text-text-main hover:bg-surface-bg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/30 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateOrderModal;
