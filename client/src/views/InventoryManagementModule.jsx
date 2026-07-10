import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { Package, Search, Plus, AlertTriangle, ArrowUpDown, History } from 'lucide-react';
import { motion } from 'framer-motion';
import StockAdjustmentModal from '../components/dashboard/StockAdjustmentModal';

const InventoryManagementModule = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const filtered = items.filter(i => 
    (i.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-text-main flex items-center gap-3">
            <Package size={28} className="text-brand-blue" />
            Inventory & Warehouses
          </h1>
          <p className="text-text-muted font-medium">Track stock levels across all your warehouse locations.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by SKU or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-card-bg border border-border-main rounded-full pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          </div>
          <button className="bg-brand-blue text-white rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20">
            <Plus size={18} /> New Item
          </button>
        </div>
      </div>

      <div className="flex-1 bg-card-bg rounded-2xl border border-border-main overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-bg border-b border-border-main sticky top-0 z-10 text-xs font-black uppercase text-text-muted tracking-wider">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Warehouse</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Value</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-text-muted font-bold animate-pulse">Loading inventory...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-text-muted font-bold">No items found.</td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const isLowStock = item.quantity <= item.reorder_point;
                  const totalValue = item.quantity * item.cost_price;

                  return (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                      className="hover:bg-surface-bg/50 transition-colors group"
                    >
                      <td className="p-4 font-mono font-bold text-text-muted text-xs">{item.sku}</td>
                      <td className="p-4 font-black text-text-main">{item.name}</td>
                      <td className="p-4 font-semibold text-text-muted">{item.warehouse?.name || 'Unknown'}</td>
                      <td className="p-4">
                        <span className={`font-black ${isLowStock ? 'text-red-500' : 'text-text-main'}`}>
                          {item.quantity}
                        </span>
                        <span className="text-xs text-text-muted ml-1">/ {item.reorder_point} (Reorder)</span>
                      </td>
                      <td className="p-4">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[10px] font-black uppercase tracking-widest">
                            <AlertTriangle size={12} /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded text-[10px] font-black uppercase tracking-widest">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-text-muted">${totalValue.toFixed(2)}</td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => { setSelectedItem(item); setIsAdjustModalOpen(true); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-bg hover:bg-gray-200 dark:hover:bg-gray-700 border border-border-main rounded-lg text-xs font-bold text-text-main transition-colors"
                        >
                          <ArrowUpDown size={14} /> Adjust
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StockAdjustmentModal 
        isOpen={isAdjustModalOpen}
        item={selectedItem}
        onClose={() => { setIsAdjustModalOpen(false); setSelectedItem(null); }}
        onAdjusted={() => fetchInventory()}
      />
    </div>
  );
};

export default InventoryManagementModule;
