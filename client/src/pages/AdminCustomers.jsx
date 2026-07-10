import React, { useState } from 'react';
import { MOCK_CUSTOMERS } from '../utils/mockData';
import { Search, Filter, MoreHorizontal, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const filtered = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusStyle = (status) => {
    if (status === 'Premium') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (status === 'Active') return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-text-muted border-border-main';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-text-main">Customers ({MOCK_CUSTOMERS.length})</h1>
          <p className="text-text-muted font-medium">Manage clients and order histories.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="bg-card-bg border border-border-main rounded-full pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-brand-blue outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          </div>
          <button className="bg-card-bg border border-border-main rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-surface-bg">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-main bg-surface-bg/50">
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Contact</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Location</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Orders</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((customer, idx) => (
              <motion.tr 
                key={customer.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                className="border-b border-gray-50 hover:bg-surface-bg/50 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-text-main text-sm">{customer.name}</p>
                      <p className="text-xs font-bold text-text-muted">{customer.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium flex items-center gap-2 text-text-muted"><Mail size={14}/> {customer.email}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium flex items-center gap-2 text-text-muted"><MapPin size={14}/> {customer.address}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${getStatusStyle(customer.status)}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-text-main">{customer.orders}</td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 text-text-muted hover:text-text-main rounded-md hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border-main flex justify-between items-center bg-card-bg">
          <p className="text-sm font-semibold text-text-muted pl-2">
            Showing {(page-1)*itemsPerPage + 1} to {Math.min(page*itemsPerPage, filtered.length)} of {filtered.length} customers
          </p>
          <div className="flex gap-2 pr-2">
            <button 
              disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-full border border-border-main text-sm font-bold disabled:opacity-50 hover:bg-surface-bg"
            >
              Prev
            </button>
            <button 
              disabled={page * itemsPerPage >= filtered.length} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-full border border-border-main text-sm font-bold disabled:opacity-50 hover:bg-surface-bg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
