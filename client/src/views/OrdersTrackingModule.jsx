import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { Truck, CheckCircle, Search, Filter, MoreHorizontal, PackageOpen, UploadCloud, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import OrderDetailsDrawer from '../components/dashboard/OrderDetailsDrawer';
import BulkOrderModal from '../components/dashboard/BulkOrderModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrdersTrackingModule = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get('/orders');
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
      // Note: Advance endpoint doesn't exist in our standard CRUD yet, mock it for UI for now
      // Or implement an update status logic here. For now we will just re-fetch to see if state changes
      fetchOrders(); // refresh
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Orders Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    autoTable(doc, {
        startY: 40,
        head: [['Tracking Code', 'Customer', 'Status', 'Progress']],
        body: filtered.map(o => [
            o.tracking_code || 'N/A', 
            o.customer_name || 'N/A', 
            o.status || 'N/A', 
            `${Number(o.progress_pct || 0).toFixed(0)}%`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
    });
    doc.save('orders-report.pdf');
    setShowExportMenu(false);
  };

  const handleExportCSV = () => {
    const headers = ['Tracking Code', 'Customer', 'Status', 'Progress'];
    const rows = filtered.map(o => [
        o.tracking_code || 'N/A', 
        o.customer_name || 'N/A', 
        o.status || 'N/A', 
        `${Number(o.progress_pct || 0).toFixed(0)}%`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  const getStatusStyle = (status) => {
    if (status === 'delivered') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'in_transit') return 'bg-blue-100 text-brand-blue border-blue-200';
    return 'bg-gray-100 text-text-muted border-border-main';
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
    >
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
          
          <div className="relative">
              <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="bg-card-bg border border-border-main text-text-main rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-surface-bg transition-colors shadow-sm"
              >
                  Export
              </button>
              
              {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card-bg rounded-xl shadow-xl border border-border-main overflow-hidden z-10">
                      <button onClick={handleExportPDF} className="w-full px-4 py-3 text-left text-sm font-semibold hover:bg-surface-bg transition-colors border-b border-border-main">
                          Export as PDF
                      </button>
                      <button onClick={handleExportCSV} className="w-full px-4 py-3 text-left text-sm font-semibold hover:bg-surface-bg transition-colors">
                          Export as CSV
                      </button>
                  </div>
              )}
          </div>

          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="bg-brand-blue text-white rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20"
          >
            <UploadCloud size={16} /> Bulk Import
          </button>
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
                    {o.source_warehouse?.name || 'Unknown'} <span className="text-gray-300">→</span> {o.dest_warehouse?.name || 'Unknown'}
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
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setSelectedOrderId(o.id); setIsDrawerOpen(true); }}
                      className="bg-card-bg border border-border-main hover:bg-surface-bg text-text-main px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button 
                      onClick={() => advanceDelivery(o.id)}
                      disabled={o.status === 'delivered'}
                      className="bg-card-bg border border-border-main hover:bg-brand-blue hover:text-white hover:border-brand-blue text-text-main px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-30 disabled:hover:bg-card-bg disabled:hover:text-text-main transition-all flex items-center gap-2"
                    >
                      {o.status === 'delivered' ? <CheckCircle size={14} /> : <Truck size={14} />}
                      Advance
                    </button>
                  </div>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-16 text-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex flex-col items-center justify-center text-text-muted"
                  >
                    <PackageOpen size={48} className="mb-4 text-border-main" strokeWidth={1} />
                    <p className="font-bold text-lg text-text-main mb-1">No orders found</p>
                    <p className="text-sm font-medium max-w-xs">We couldn't find any orders matching your criteria. Try adjusting your filters or search term.</p>
                  </motion.div>
                </td>
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

      <OrderDetailsDrawer 
        isOpen={isDrawerOpen} 
        orderId={selectedOrderId} 
        onClose={() => { setIsDrawerOpen(false); setSelectedOrderId(null); }}
        onVerified={() => fetchOrders()}
      />

      <BulkOrderModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImported={() => fetchOrders()}
      />
    </motion.div>
  );
};

export default OrdersTrackingModule;
