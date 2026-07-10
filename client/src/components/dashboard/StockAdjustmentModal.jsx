import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const StockAdjustmentModal = ({ isOpen, onClose, item, onAdjusted }) => {
  const [changeAmount, setChangeAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !item) return null;

  const handleAdjust = async (e) => {
    e.preventDefault();
    const amount = parseInt(changeAmount);
    if (isNaN(amount) || amount === 0) return alert('Enter a valid non-zero amount');
    
    setLoading(true);
    try {
      await api.post(`/inventory/${item.id}/adjust`, { change_amount: amount, reason });
      setChangeAmount('');
      setReason('');
      if (onAdjusted) onAdjusted();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Adjustment failed");
    } finally {
      setLoading(false);
    }
  };

  const isPositive = parseInt(changeAmount) > 0;
  const isNegative = parseInt(changeAmount) < 0;
  const newQty = item.quantity + (parseInt(changeAmount) || 0);

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
              <Package size={20} className="text-brand-blue" />
              Adjust Stock
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-surface-bg rounded-full transition-colors">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          <form onSubmit={handleAdjust} className="p-6 space-y-6">
            <div className="bg-surface-bg p-4 rounded-xl border border-border-main text-sm">
              <p className="font-bold text-text-main mb-1">{item.name}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider">SKU: {item.sku}</p>
            </div>

            <div className="flex items-center justify-between text-center gap-4">
              <div className="flex-1 bg-surface-bg p-4 rounded-xl border border-border-main">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Current</p>
                <p className="mt-1 font-black text-xl text-text-main">{item.quantity}</p>
              </div>
              <div className="flex-shrink-0 text-text-muted font-bold text-xl">→</div>
              <div className={`flex-1 p-4 rounded-xl border ${newQty < 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-brand-blue/10 border-brand-blue/30'}`}>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">New</p>
                <p className={`mt-1 font-black text-xl ${newQty < 0 ? 'text-red-500' : 'text-brand-blue'}`}>{newQty}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Change Amount</label>
              <div className="relative">
                <input 
                  type="number"
                  value={changeAmount}
                  onChange={e => setChangeAmount(e.target.value)}
                  placeholder="e.g. 50 or -10"
                  className="w-full bg-surface-bg border border-border-main rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {isPositive && <ArrowUpRight className="text-green-500" size={20} />}
                  {isNegative && <ArrowDownRight className="text-red-500" size={20} />}
                  {!isPositive && !isNegative && <Package className="text-text-muted" size={20} />}
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2 font-medium">Use positive numbers to add stock, negative to remove.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Reason (Optional)</label>
              <input 
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Restock delivery from supplier"
                className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || newQty < 0 || isNaN(parseInt(changeAmount)) || parseInt(changeAmount) === 0}
              className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? 'Processing...' : 'Confirm Adjustment'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StockAdjustmentModal;
