import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Truck, CheckCircle, Search, Filter, MoreHorizontal, PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const OrdersTrackingModule = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const advanceDelivery = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/orders/${id}/advance`);
      fetchOrders(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = orders.filter(o => 
    (o.tracking_code || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusStyle = (status) => {
    if (status === 'delivered') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'in_transit') return 'bg-blue-100 text-brand-blue border-blue-200';
    return 'bg-gray-100 text-text-muted border-border-main';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-text-main">Orders ({orders.length})</h1>
          <p className="text-text-muted font-medium">Manage and track active logistics deliveries.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="bg-card-bg border border-border-main rounded-full pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          </div>
          <button className="bg-card-bg border border-border-main rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-surface-bg transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-main bg-surface-bg/50">
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Tracking Code</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Route</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Progress</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? paginated.map((o, idx) => (
              <motion.tr 
                key={o.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                className="border-b border-border-main hover:bg-surface-bg/50 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
                      <PackageOpen size={18} strokeWidth={2.5} />
                    </div>
                    <p className="font-bold text-brand-blue text-sm uppercase">{o.tracking_code}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="font-bold text-text-main text-sm">{o.customer_name}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm font-medium text-text-muted flex items-center gap-2">
                    {o.source_name} <span className="text-gray-300">→</span> {o.dest_name}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-[11px] font-bold rounded-full border uppercase ${getStatusStyle(o.status)}`}>
                    {(o.status || '').replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="w-32 bg-surface-bg border border-border-main rounded-full h-2.5 overflow-hidden">
                    <div className="bg-brand-blue h-full rounded-full transition-all duration-500" style={{ width: `${o.progress_pct || 0}%` }}></div>
                  </div>
                  <div className="text-xs font-bold text-text-muted mt-1">{Number(o.progress_pct || 0).toFixed(0)}%</div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => advanceDelivery(o.id)}
                    disabled={o.status === 'delivered'}
                    className="bg-card-bg border border-border-main hover:bg-brand-blue hover:text-white hover:border-brand-blue text-text-main px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-30 disabled:hover:bg-card-bg disabled:hover:text-text-main transition-all flex items-center gap-2 ml-auto"
                  >
                    {o.status === 'delivered' ? <CheckCircle size={14} /> : <Truck size={14} />}
                    Advance
                  </button>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-text-muted font-medium">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="p-4 border-t border-border-main flex justify-between items-center bg-card-bg">
            <p className="text-sm font-semibold text-text-muted pl-2">
              Showing {(page-1)*itemsPerPage + 1} to {Math.min(page*itemsPerPage, filtered.length)} of {filtered.length} orders
            </p>
            <div className="flex gap-2 pr-2">
              <button 
                disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-full border border-border-main text-sm font-bold disabled:opacity-50 hover:bg-surface-bg transition-colors"
              >
                Prev
              </button>
              <button 
                disabled={page * itemsPerPage >= filtered.length} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-full border border-border-main text-sm font-bold disabled:opacity-50 hover:bg-surface-bg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTrackingModule;
