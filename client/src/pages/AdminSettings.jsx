import React from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Building2, Truck, Users, MapPin, 
  Bell, Palette, Shield, Link as LinkIcon, 
  Key, Database, CreditCard, Info 
} from 'lucide-react';

// Placeholder sub-components for settings sections
const SectionPlaceholder = ({ title, desc }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-8">
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-6">{desc}</p>
    <div className="flex flex-col items-center justify-center py-12 text-gray-300">
      <Settings size={48} className="mb-4 opacity-50 animate-spin-slow" />
      <p className="font-medium text-gray-400">This settings module is currently under construction.</p>
    </div>
  </motion.div>
);

const GeneralSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">General System Preferences</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platform Name</label>
          <input type="text" defaultValue="Smart Delivery System" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Timezone</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue">
            <option>UTC (Coordinated Universal Time)</option>
            <option>PST (Pacific Standard Time)</option>
            <option>EST (Eastern Standard Time)</option>
            <option>IST (Indian Standard Time)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Currency</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue">
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>INR (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date Format</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue">
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-dark transition-colors">
          Save General Settings
        </button>
      </div>
    </div>
  </motion.div>
);

const AdminSettings = () => {
  const location = useLocation();

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

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Settings</h1>
        <p className="text-gray-500 font-medium mt-1">Configure your logistics platform and network parameters.</p>
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
                  ${isActive ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' : 'text-gray-600 hover:bg-gray-100'}
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
              <Route path="general" element={<GeneralSettings />} />
              <Route path="company" element={<SectionPlaceholder title="Company Profile" desc="Manage business details, tax IDs, and public facing information." />} />
              <Route path="delivery" element={<SectionPlaceholder title="Delivery Configuration" desc="Set max radius, base charges, and vehicle types." />} />
              <Route path="drivers" element={<SectionPlaceholder title="Driver Parameters" desc="Configure shift timings, max orders per driver, and minimum rating." />} />
              <Route path="warehouses" element={<SectionPlaceholder title="Warehouse Settings" desc="Manage storage limits, sorting rules, and regional assignments." />} />
              <Route path="notifications" element={<SectionPlaceholder title="Alert Preferences" desc="Toggle email, SMS, and push notifications for systemic events." />} />
              <Route path="appearance" element={<SectionPlaceholder title="Appearance" desc="Customize themes, primary colors, and UI density." />} />
              <Route path="security" element={<SectionPlaceholder title="Security & Access" desc="Manage active sessions, 2FA, and device policies." />} />
              <Route path="integrations" element={<SectionPlaceholder title="Integrations" desc="Connect third party services like Google Maps, Stripe, and Twilio." />} />
              <Route path="api" element={<SectionPlaceholder title="API Keys" desc="Generate and revoke developer access tokens." />} />
              <Route path="backup" element={<SectionPlaceholder title="Backup & Restore" desc="Configure automated database snapshots." />} />
              <Route path="billing" element={<SectionPlaceholder title="Billing & Plans" desc="Manage your subscription and payment methods." />} />
              <Route path="about" element={<SectionPlaceholder title="About System" desc="System version, licenses, and diagnostics." />} />
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
