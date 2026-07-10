import React, { useState } from 'react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const BulkOrderModal = ({ isOpen, onClose, onImported }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const headers = lines[0].split(',').map(h => h.trim());
        
        const orders = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const order = {};
          headers.forEach((header, index) => {
            order[header] = values[index];
          });
          orders.push(order);
        }

        const res = await api.post('/orders/bulk', { orders });
        alert(`Successfully imported ${res.data.count} orders!`);
        if (onImported) onImported();
        onClose();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to process CSV file.");
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError("Failed to read file");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-lg bg-card-bg shadow-2xl rounded-2xl border border-border-main overflow-hidden"
        >
          <div className="p-6 border-b border-border-main flex justify-between items-center bg-surface-bg/50">
            <h2 className="text-xl font-black text-text-main">Bulk Import Orders</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="border-2 border-dashed border-border-main hover:border-brand-blue rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors bg-surface-bg/30">
              <div className="bg-brand-blue/10 p-4 rounded-full text-brand-blue mb-4">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-main">Upload CSV File</h3>
              <p className="text-sm text-text-muted mt-2 mb-6 font-medium max-w-xs">
                Drag and drop your CSV file here, or click to select files. Required columns: <code className="bg-card-bg px-1 py-0.5 rounded text-xs">customer_name</code>, <code className="bg-card-bg px-1 py-0.5 rounded text-xs">budget</code>
              </p>
              
              <label className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/30 inline-flex items-center gap-2">
                {loading ? 'Uploading...' : 'Browse Files'}
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={loading}
                />
              </label>
            </div>
            
            <div className="mt-6 text-center">
              <a href="#" className="text-sm font-bold text-brand-blue hover:underline">Download CSV Template</a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BulkOrderModal;
