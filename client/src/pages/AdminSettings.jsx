import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Building2, Truck, Users, MapPin, 
  Bell, Palette, Shield, Link as LinkIcon, 
  Key, Database, CreditCard, Info, Plus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const GenericSaveButton = ({ label = "Save Changes", onClick, status }) => (
  <div className="mt-8 flex justify-end items-center gap-4">
    {status && <span className="text-sm font-semibold text-brand-blue">{status}</span>}
    <button onClick={onClick} className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:opacity-90 transition-opacity">
      {label}
    </button>
  </div>
);

const GeneralSettings = ({ data, setData, onSave, status }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">General System Preferences</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Platform Name</label>
          <input type="text" value={data.name || ''} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Timezone</label>
          <select value={data.timezone || 'UTC'} onChange={e => setData({...data, timezone: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="PST">PST (Pacific Standard Time)</option>
            <option value="EST">EST (Eastern Standard Time)</option>
            <option value="IST">IST (Indian Standard Time)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Currency</label>
          <select value={data.currency || 'USD'} onChange={e => setData({...data, currency: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Date Format</label>
          <select value={data.date_format || 'MM/DD/YYYY'} onChange={e => setData({...data, date_format: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
      <GenericSaveButton label="Save General Settings" onClick={onSave} status={status} />
    </div>
  </motion.div>
);

const CompanySettings = ({ data, setData, onSave, status }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Company Profile</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Company Legal Name</label>
          <input type="text" value={data.name || ''} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Tax ID / EIN</label>
          <input type="text" value={data.tax_id || ''} onChange={e => setData({...data, tax_id: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Support Email</label>
          <input type="email" value={data.support_email || ''} onChange={e => setData({...data, support_email: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Phone Number</label>
          <input type="text" value={data.phone || ''} onChange={e => setData({...data, phone: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Headquarters Address</label>
          <textarea rows="3" value={data.address || ''} onChange={e => setData({...data, address: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main"></textarea>
        </div>
      </div>
      <GenericSaveButton label="Update Company Profile" onClick={onSave} status={status} />
    </div>
  </motion.div>
);

const DeliverySettings = ({ data, setData, onSave, status }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Delivery Configuration</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Base Fare ($)</label>
          <input type="number" step="0.01" value={data.base_fare || 0} onChange={e => setData({...data, base_fare: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Price Per KM ($)</label>
          <input type="number" step="0.01" value={data.price_per_km || 0} onChange={e => setData({...data, price_per_km: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Max Delivery Radius (KM)</label>
          <input type="number" value={data.max_delivery_radius || 0} onChange={e => setData({...data, max_delivery_radius: e.target.value})} className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
      </div>
      <GenericSaveButton label="Save Delivery Settings" onClick={onSave} status={status} />
    </div>
  </motion.div>
);

const DriversSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Driver Parameters</h3>
      <p className="text-text-muted mb-4">Driver parameters are managed via the Rules Engine.</p>
    </div>
  </motion.div>
);

const WarehousesSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Warehouse Settings</h3>
      <p className="text-text-muted mb-4">Warehouse settings are managed individually in the Warehouse module.</p>
    </div>
  </motion.div>
);

const NotificationsSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Alert Preferences</h3>
      <p className="text-text-muted mb-4">Notifications logic uses the Rules Engine. These settings are a placeholder for future webhook configuration.</p>
    </div>
  </motion.div>
);

const AppearanceSettings = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="premium-card p-8">
        <h3 className="font-bold text-lg mb-6">Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Theme Mode</label>
            <select 
              value={theme}
              onChange={toggleTheme}
              className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
            <p className="text-xs text-text-muted mt-2">Changing this instantly applies the theme globally.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SecuritySettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Security & Access</h3>
      <p className="text-text-muted mb-4">Security settings are managed at the provider level.</p>
    </div>
  </motion.div>
);

const IntegrationsSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Third-Party Integrations</h3>
      <p className="text-text-muted mb-4">Use the Marketplace to install and configure integrations.</p>
    </div>
  </motion.div>
);

const ApiKeysSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Developer API Keys</h3>
      <p className="text-text-muted mb-4">Developer Keys are now managed in the dedicated Developer module.</p>
    </div>
  </motion.div>
);

const BackupSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Backup & Restore</h3>
      <p className="text-text-muted mb-4">Database backups are managed securely at the infrastructure level (Neon DB).</p>
    </div>
  </motion.div>
);

const BillingSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8 border-t-4 border-t-brand-blue">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-bold text-xl text-text-main">Subscription Plan</h3>
          <p className="text-sm text-text-muted mt-1">Your company's subscription tier.</p>
        </div>
      </div>
      <p className="text-text-muted mb-4">Billing is managed centrally. Please contact support to change your plan.</p>
    </div>
  </motion.div>
);

const AboutSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8 flex flex-col items-center justify-center text-center py-12">
      <div className="bg-brand-blue p-4 rounded-3xl text-white shadow-xl shadow-brand-blue/30 mb-6">
        <Truck size={48} strokeWidth={2} />
      </div>
      <h2 className="font-black text-2xl text-text-main tracking-tight">Smart Delivery System (SLRROS)</h2>
      <p className="font-bold text-brand-blue mt-2">Version 2.4.0 (Enterprise)</p>
      <p className="text-text-muted font-medium mt-4 max-w-md mx-auto leading-relaxed">
        Next-generation logistics and warehouse management platform powered by real-time analytics and intelligent routing algorithms.
      </p>
    </div>
  </motion.div>
);

const AdminSettings = () => {
  const location = useLocation();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/settings/company')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching settings', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    try {
      setStatus('Saving...');
      await api.put('/settings/company', data);
      setStatus('Saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error saving settings');
    }
  };

  const sections = [
    { path: 'general', label: 'General', icon: Settings },
    { path: 'company', label: 'Company', icon: Building2 },
    { path: 'delivery', label: 'Delivery', icon: Truck },
    { path: 'drivers', label: 'Drivers', icon: Users },
    { path: 'warehouses', label: 'Warehouses', icon: MapPin },
    { path: 'notifications', label: 'Notifications', icon: Bell },
    { path: 'appearance', label: 'Appearance', icon: Palette },
    { path: 'security', label: 'Security', icon: Shield },
    { path: 'integrations', label: 'Integrations', icon: LinkIcon },
    { path: 'api', label: 'API Keys', icon: Key },
    { path: 'backup', label: 'Backup', icon: Database },
    { path: 'billing', label: 'Billing', icon: CreditCard },
    { path: 'about', label: 'About', icon: Info },
  ];

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-3xl font-black text-text-main">Settings</h1>
        <p className="text-text-muted font-medium mt-1">Configure your logistics platform and network parameters.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <NavLink
                key={sec.path}
                to={`/admin/settings/${sec.path}`}
                className={({ isActive }) => `
                  w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-3
                  ${isActive ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' : 'text-text-muted hover:bg-surface-bg hover:text-text-main'}
                `}
              >
                <Icon size={18} /> {sec.label}
              </NavLink>
            )
          })}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="general" replace />} />
              <Route path="general" element={<GeneralSettings data={data} setData={setData} onSave={handleSave} status={status} />} />
              <Route path="company" element={<CompanySettings data={data} setData={setData} onSave={handleSave} status={status} />} />
              <Route path="delivery" element={<DeliverySettings data={data} setData={setData} onSave={handleSave} status={status} />} />
              <Route path="drivers" element={<DriversSettings />} />
              <Route path="warehouses" element={<WarehousesSettings />} />
              <Route path="notifications" element={<NotificationsSettings />} />
              <Route path="appearance" element={<AppearanceSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="integrations" element={<IntegrationsSettings />} />
              <Route path="api" element={<ApiKeysSettings />} />
              <Route path="backup" element={<BackupSettings />} />
              <Route path="billing" element={<BillingSettings />} />
              <Route path="about" element={<AboutSettings />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #CBD5E1; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdminSettings;
