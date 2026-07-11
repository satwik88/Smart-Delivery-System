import React, { useState } from 'react';
import { X, UserPlus, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const AddDriverModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/drivers', formData);
      setFormData({ username: '', password: '' });
      if (onAdded) onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add driver");
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
              <UserPlus size={20} className="text-brand-blue" />
              Add New Driver
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
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Username</label>
              <input 
                type="text"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                placeholder="e.g. john_doe"
                className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                <Key size={14} /> Password
              </label>
              <input 
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="Secure password for driver login"
                className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !formData.username || !formData.password}
              className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none mt-4"
            >
              {loading ? 'Creating...' : 'Create Driver'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddDriverModal;
