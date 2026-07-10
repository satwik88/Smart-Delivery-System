import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import clsx from 'clsx';
import { MoreHorizontal } from 'lucide-react';

const StatusBadge = ({ status }) => {
  // Map DB status to UI format
  let uiStatus = 'Pending';
  let styles = 'bg-yellow-100 text-yellow-700 border-yellow-200';
  
  if (status === 'delivered') {
    uiStatus = 'Delivered';
    styles = 'bg-green-100 text-green-700 border-green-200';
  } else if (status === 'in_transit' || status === 'packed' || status === 'dispatched') {
    uiStatus = 'In Transit';
    styles = 'bg-blue-100 text-blue-700 border-blue-200';
  } else if (status === 'cancelled') {
    uiStatus = 'Cancelled';
    styles = 'bg-red-100 text-red-700 border-red-200';
  }

  return (
    <span className={clsx("px-3 py-1 text-xs font-bold rounded-full border", styles)}>
      {uiStatus}
    </span>
  );
};

const RecentOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        // Slice top 5 for the dashboard
        setOrders(response.data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="premium-card p-8 h-[400px] flex items-center justify-center font-bold text-text-muted">Loading Orders...</div>;
  }

  return (
    <div className="premium-card p-8 overflow-hidden flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-main">Recent Orders</h2>
        <span className="text-brand-blue font-bold text-sm cursor-pointer hover:underline">View All</span>
      </div>
      
      <div className="flex-1 overflow-auto pr-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-main">
              <th className="py-3 px-2 text-xs font-bold text-text-muted uppercase tracking-wider">Order ID</th>
              <th className="py-3 px-2 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
              <th className="py-3 px-2 text-xs font-bold text-text-muted uppercase tracking-wider">Route</th>
              <th className="py-3 px-2 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
              {/* ETA and Payment are mocked because they are not in the db currently */}
              <th className="py-3 px-2 text-xs font-bold text-text-muted uppercase tracking-wider group relative cursor-help">
                ETA <span className="hidden group-hover:block absolute -top-6 bg-card-bg border border-border-main text-text-main text-[10px] px-2 py-1 rounded">Mocked Data</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id || idx} className="border-b border-border-main hover:bg-surface-bg/50 transition-colors group">
                <td className="py-4 px-2 font-bold text-text-main text-sm">#{order.tracking_code || `ORD-${order.id}`}</td>
                <td className="py-4 px-2 font-semibold text-text-main text-sm">{order.customer_name}</td>
                <td className="py-4 px-2 text-text-muted text-xs font-medium">
                  {order.source_warehouse?.name || 'Unknown'} → {order.dest_warehouse?.name || 'Unknown'}
                </td>
                <td className="py-4 px-2">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-4 px-2 font-bold text-text-main text-sm">
                  {order.status === 'delivered' ? '-' : '24 mins'}
                </td>
                <td className="py-4 px-2 text-right">
                  <button className="p-1.5 text-text-muted hover:text-text-main rounded-md hover:bg-surface-bg border border-transparent hover:border-border-main transition-all opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" className="text-center py-8 text-text-muted font-medium">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
