import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Truck, CheckCircle } from 'lucide-react';

const OrdersTrackingModule = () => {
  const [orders, setOrders] = useState([]);

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

  return (
    <div className="flex flex-col h-full gap-6 relative z-10 overflow-auto pb-8">
      <div className="glass-panel p-6 shrink-0">
        <h2 className="text-xl font-bold text-slate-100">Orders & Tracking Control</h2>
        <p className="text-sm text-slate-400">Manage orders and simulate delivery progress for demonstrations.</p>
      </div>

      <div className="glass-panel p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b border-slate-700 text-slate-400 font-medium">Tracking Code</th>
              <th className="p-3 border-b border-slate-700 text-slate-400 font-medium">Customer</th>
              <th className="p-3 border-b border-slate-700 text-slate-400 font-medium">Route</th>
              <th className="p-3 border-b border-slate-700 text-slate-400 font-medium">Status</th>
              <th className="p-3 border-b border-slate-700 text-slate-400 font-medium">Progress</th>
              <th className="p-3 border-b border-slate-700 text-slate-400 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-slate-800/50">
                <td className="p-3 border-b border-slate-800 text-neon-blue font-mono text-sm">{o.tracking_code}</td>
                <td className="p-3 border-b border-slate-800 text-slate-300">{o.customer_name}</td>
                <td className="p-3 border-b border-slate-800 text-slate-400 text-sm">
                  {o.source_name} → {o.dest_name}
                </td>
                <td className="p-3 border-b border-slate-800">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    o.status === 'delivered' ? 'bg-accent-green/20 text-accent-green' :
                    o.status === 'in_transit' ? 'bg-neon-blue/20 text-neon-blue' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {o.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-3 border-b border-slate-800">
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-neon-blue h-2.5 rounded-full transition-all" style={{ width: `${o.progress_pct}%` }}></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{o.progress_pct.toFixed(0)}%</div>
                </td>
                <td className="p-3 border-b border-slate-800">
                  <button 
                    onClick={() => advanceDelivery(o.id)}
                    disabled={o.status === 'delivered'}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm disabled:opacity-30 flex items-center gap-2"
                  >
                    {o.status === 'delivered' ? <CheckCircle size={14} /> : <Truck size={14} />}
                    Advance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTrackingModule;
