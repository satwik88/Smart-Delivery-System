import React, { useState, useEffect } from 'react';
import { Activity, Users, Building, ShieldAlert, CheckCircle, Search, Power } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SuperAdminDashboard = () => {
  const [metrics, setMetrics] = useState({ total_companies: 0, active_companies: 0, mrr: 0 });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('superAdminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [metRes, compRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/metrics`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/companies`, { headers })
      ]);
      setMetrics(metRes.data);
      setCompanies(compRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendToggle = async (companyId, currentlySuspended) => {
    try {
      const token = localStorage.getItem('superAdminToken');
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/companies/${companyId}/suspend`, 
        { suspend: !currentlySuspended },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminToken');
    window.location.href = '/admin';
  };

  if (loading) return <div className="p-10 text-center text-text-muted font-bold animate-pulse">Loading Super Admin Data...</div>;

  return (
    <div className="min-h-screen bg-surface-bg p-6 lg:p-10 font-sans text-text-main">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="flex justify-between items-center bg-card-bg p-6 rounded-2xl border border-border-main shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-text-main">Super Admin Portal</h1>
            <p className="text-text-muted font-medium text-sm mt-1">Platform-wide multitenancy management.</p>
          </div>
          <button 
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 border-l-4 border-l-brand-blue">
            <p className="text-sm font-black text-text-muted uppercase tracking-widest flex items-center gap-2"><Building size={16}/> Total Tenants</p>
            <p className="mt-4 text-4xl font-black">{metrics.total_companies}</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6 border-l-4 border-l-green-500">
            <p className="text-sm font-black text-text-muted uppercase tracking-widest flex items-center gap-2"><CheckCircle size={16}/> Active Tenants</p>
            <p className="mt-4 text-4xl font-black text-green-500">{metrics.active_companies}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6 border-l-4 border-l-purple-500">
            <p className="text-sm font-black text-text-muted uppercase tracking-widest flex items-center gap-2"><Activity size={16}/> Platform MRR</p>
            <p className="mt-4 text-4xl font-black text-purple-500">${metrics.mrr}<span className="text-sm text-text-muted">/mo</span></p>
          </motion.div>
        </div>

        <div className="bg-card-bg border border-border-main rounded-2xl overflow-hidden shadow-sm">
           <div className="p-6 border-b border-border-main flex justify-between items-center">
             <h2 className="text-xl font-black">Registered Companies</h2>
           </div>
           
           <table className="w-full text-left">
              <thead className="bg-surface-bg border-b border-border-main text-xs font-black uppercase text-text-muted tracking-wider">
                <tr>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Tier</th>
                  <th className="p-4">Users</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main text-sm">
                {companies.map(c => (
                  <tr key={c.id} className="hover:bg-surface-bg/50 transition-colors">
                    <td className="p-4 font-bold text-text-main">{c.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${c.subscription_tier === 'PRO' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {c.subscription_tier}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted font-medium">{c._count.users}</td>
                    <td className="p-4 text-text-muted font-medium">{c._count.orders}</td>
                    <td className="p-4">
                      {c.status === 'ACTIVE' ? (
                         <span className="text-green-500 font-black text-xs uppercase flex items-center gap-1"><CheckCircle size={14}/> Active</span>
                      ) : (
                         <span className="text-red-500 font-black text-xs uppercase flex items-center gap-1"><ShieldAlert size={14}/> Suspended</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                       <button 
                         onClick={() => handleSuspendToggle(c.id, c.status === 'SUSPENDED')}
                         className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${c.status === 'ACTIVE' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                       >
                         <Power size={14} className="inline mr-1" />
                         {c.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
