import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const FinancialModule = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [billingStatus, setBillingStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, transRes, billRes] = await Promise.all([
        api.get('/finance/summary'),
        api.get('/finance/transactions'),
        api.get('/billing/status').catch(() => ({ data: { tier: 'FREE' } }))
      ]);
      setSummary(sumRes.data);
      setTransactions(transRes.data);
      setBillingStatus(billRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  if (loading) {
    return <div className="p-10 text-center text-text-muted font-bold animate-pulse">Loading financial data...</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto h-full overflow-y-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-text-main flex items-center gap-3">
            <DollarSign size={32} className="text-brand-blue bg-brand-blue/10 p-1.5 rounded-xl" />
            Financial Management
          </h1>
          <p className="text-text-muted font-medium mt-1">Track your revenue, expenses, and overall profitability.</p>
        </div>
      </div>

      {/* P&L Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="premium-card p-6 border-l-4 border-l-green-500 relative overflow-hidden group"
        >
          <TrendingUp className="absolute -right-4 -bottom-4 text-green-500/10 group-hover:text-green-500/20 transition-colors" size={100} />
          <p className="text-sm font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
            <ArrowUpRight size={16} className="text-green-500" /> Total Revenue
          </p>
          <p className="mt-4 text-4xl font-black text-text-main">{formatCurrency(summary?.revenue)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="premium-card p-6 border-l-4 border-l-red-500 relative overflow-hidden group"
        >
          <TrendingDown className="absolute -right-4 -bottom-4 text-red-500/10 group-hover:text-red-500/20 transition-colors" size={100} />
          <p className="text-sm font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
            <ArrowDownRight size={16} className="text-red-500" /> Total Expenses
          </p>
          <p className="mt-4 text-4xl font-black text-text-main">{formatCurrency(summary?.expenses)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`premium-card p-6 border-l-4 relative overflow-hidden group ${summary?.net_profit >= 0 ? 'border-l-brand-blue' : 'border-l-yellow-500'}`}
        >
          <Activity className={`absolute -right-4 -bottom-4 transition-colors ${summary?.net_profit >= 0 ? 'text-brand-blue/10 group-hover:text-brand-blue/20' : 'text-yellow-500/10 group-hover:text-yellow-500/20'}`} size={100} />
          <p className="text-sm font-black text-text-muted uppercase tracking-widest">Net Profit</p>
          <p className={`mt-4 text-4xl font-black ${summary?.net_profit >= 0 ? 'text-brand-blue' : 'text-yellow-500'}`}>
            {formatCurrency(summary?.net_profit)}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ledger Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-black text-text-main">Transaction Ledger</h2>
          <div className="bg-card-bg border border-border-main rounded-2xl overflow-hidden shadow-sm flex-1">
            <table className="w-full text-left">
              <thead className="bg-surface-bg border-b border-border-main text-xs font-black uppercase text-text-muted tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main text-sm">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-text-muted font-bold">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id} className="hover:bg-surface-bg/50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-text-muted font-medium flex items-center gap-2">
                        <Clock size={14} /> {new Date(t.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${t.type === 'REVENUE' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-text-main">{t.category}</td>
                      <td className="p-4 text-text-muted">{t.description}</td>
                      <td className={`p-4 text-right font-black ${t.type === 'REVENUE' ? 'text-green-500' : 'text-red-500'}`}>
                        {t.type === 'REVENUE' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription / Stripe Panel */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black text-text-main">SaaS Subscription</h2>
          <div className="premium-card p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-text-main">Current Tier</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${billingStatus?.tier === 'PRO' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                {billingStatus?.tier || 'FREE'}
              </span>
            </div>
            <p className="text-sm font-medium text-text-muted">
              {billingStatus?.tier === 'PRO' ? 'You have access to all premium enterprise features.' : 'Upgrade to Pro for advanced features and analytics.'}
            </p>
            
            <button 
              className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md ${billingStatus?.tier === 'PRO' ? 'bg-surface-bg text-text-main border border-border-main hover:bg-gray-200' : 'bg-brand-blue text-white hover:bg-blue-700 shadow-brand-blue/30'}`}
              onClick={() => {
                if(billingStatus?.tier !== 'PRO') {
                  api.post('/billing/upgrade').then(res => {
                    if(res.data.url) window.location.href = res.data.url;
                  }).catch(e => alert('Failed to initiate upgrade'));
                }
              }}
            >
              {billingStatus?.tier === 'PRO' ? 'Manage Subscription' : 'Upgrade to PRO ($49/mo)'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinancialModule;
