import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const AdminBilling = () => {
  const [billingStatus, setBillingStatus] = useState({ tier: 'FREE', hasStripe: false });
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/billing/status');
        setBillingStatus(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();

    // Check URL params for success/cancel
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      alert("Payment successful! Your account is being upgraded.");
      // For this demo, since we don't have stripe webhooks set up on local, 
      // we'll hit the manual success endpoint to upgrade the DB.
      api.post('/billing/manual-success').then(() => {
        setBillingStatus(prev => ({ ...prev, tier: 'PRO' }));
        window.history.replaceState({}, '', '/admin/billing');
      });
    }
    if (params.get('canceled')) {
      alert("Payment canceled.");
      window.history.replaceState({}, '', '/admin/billing');
    }
  }, []);

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const res = await api.post('/billing/upgrade');
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to initiate upgrade.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-muted font-bold animate-pulse">Loading billing details...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-text-main">Billing & Subscriptions</h1>
        <p className="text-text-muted font-medium mt-1">Manage your plan and payment methods.</p>
      </div>

      <div className="premium-card p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-l-4 border-l-brand-blue">
        <div>
          <h2 className="text-xl font-bold text-text-main">Current Plan</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider ${billingStatus.tier === 'PRO' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
              {billingStatus.tier}
            </span>
            <span className="text-sm font-medium text-text-muted">
              {billingStatus.tier === 'PRO' ? 'Active and enjoying premium features.' : 'Basic features limited.'}
            </span>
          </div>
        </div>
        <div className="text-right">
           <button 
             className="px-6 py-2.5 rounded-xl border border-border-main text-sm font-bold text-text-main hover:bg-surface-bg flex items-center gap-2"
           >
             <CreditCard size={18} /> Manage Payment Methods
           </button>
        </div>
      </div>

      {billingStatus.tier !== 'PRO' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6 mt-4"
        >
          {/* Free Tier */}
          <div className="premium-card p-8 border-2 border-transparent opacity-80">
            <h3 className="text-2xl font-black text-text-main">Free Tier</h3>
            <p className="text-text-muted mt-2 font-medium">Standard logistics management.</p>
            <div className="text-4xl font-black my-6">$0 <span className="text-lg text-text-muted font-medium">/mo</span></div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={18} className="text-gray-400" /> Basic CRUD Operations</li>
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={18} className="text-gray-400" /> Up to 500 Orders / mo</li>
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={18} className="text-gray-400" /> Standard Support</li>
            </ul>
            
            <button disabled className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 font-bold uppercase tracking-wider text-sm">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="premium-card p-8 border-2 border-brand-blue relative shadow-2xl shadow-brand-blue/10">
            <div className="absolute top-0 right-0 bg-brand-blue text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-xl">
              Recommended
            </div>
            <h3 className="text-2xl font-black text-text-main flex items-center gap-2">Pro Tier <Zap size={24} className="text-yellow-400 fill-yellow-400" /></h3>
            <p className="text-text-muted mt-2 font-medium">Unlock the full potential of your fleet.</p>
            <div className="text-4xl font-black my-6">$49 <span className="text-lg text-text-muted font-medium">/mo</span></div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm font-bold text-brand-blue"><CheckCircle size={18} className="text-brand-blue" /> Real-time Live Operations Map</li>
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={18} className="text-brand-blue" /> Unlimited Orders</li>
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={18} className="text-brand-blue" /> Priority 24/7 Support</li>
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={18} className="text-brand-blue" /> Advanced Algorithms (Coming Soon)</li>
            </ul>
            
            <button 
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-bold uppercase tracking-wider text-sm shadow-lg shadow-brand-blue/30 hover:-translate-y-1 transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {upgradeLoading ? 'Redirecting...' : 'Upgrade Now'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminBilling;
