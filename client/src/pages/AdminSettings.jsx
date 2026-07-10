import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Building2, Truck, Users, MapPin, 
  Bell, Palette, Shield, Link as LinkIcon, 
  Key, Database, CreditCard, Info, Plus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GenericSaveButton = ({ label = "Save Changes" }) => (
  <div className="mt-8 flex justify-end">
    <button className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:opacity-90 transition-opacity">
      {label}
    </button>
  </div>
);

const GeneralSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">General System Preferences</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Platform Name</label>
          <input type="text" defaultValue="Smart Delivery System" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Timezone</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>UTC (Coordinated Universal Time)</option>
            <option>PST (Pacific Standard Time)</option>
            <option>EST (Eastern Standard Time)</option>
            <option>IST (Indian Standard Time)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Currency</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>INR (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Date Format</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
      </div>
      <GenericSaveButton label="Save General Settings" />
    </div>
  </motion.div>
);

const CompanySettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Company Profile</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Company Legal Name</label>
          <input type="text" defaultValue="SLRROS Logistics LLC" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Tax ID / EIN</label>
          <input type="text" defaultValue="XX-XXXXXXX" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Support Email</label>
          <input type="email" defaultValue="support@slrros.com" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Phone Number</label>
          <input type="text" defaultValue="+1 (555) 123-4567" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Headquarters Address</label>
          <textarea rows="3" defaultValue="123 Logistics Way, Suite 400\nSan Francisco, CA 94105" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main"></textarea>
        </div>
      </div>
      <GenericSaveButton label="Update Company Profile" />
    </div>
  </motion.div>
);

const DeliverySettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Delivery Configuration</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Base Fare ($)</label>
          <input type="number" defaultValue="5.00" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Price Per KM ($)</label>
          <input type="number" defaultValue="1.50" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Max Delivery Radius (KM)</label>
          <input type="number" defaultValue="50" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Allowed Vehicle Types</label>
          <select multiple className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main h-24">
            <option selected>Bicycle</option>
            <option selected>Motorcycle</option>
            <option selected>Car</option>
            <option selected>Van</option>
            <option>Truck</option>
          </select>
        </div>
      </div>
      <GenericSaveButton label="Save Delivery Settings" />
    </div>
  </motion.div>
);

const DriversSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Driver Parameters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Max Shift Duration (Hours)</label>
          <input type="number" defaultValue="12" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Max Concurrent Orders</label>
          <input type="number" defaultValue="3" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Minimum Acceptable Rating</label>
          <input type="number" step="0.1" defaultValue="4.2" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Auto-Assign Orders</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>Enabled</option>
            <option>Disabled (Manual Dispatch)</option>
          </select>
        </div>
      </div>
      <GenericSaveButton label="Save Driver Settings" />
    </div>
  </motion.div>
);

const WarehousesSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Warehouse Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Default Storage Limit (Items)</label>
          <input type="number" defaultValue="10000" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Auto-Sorting Rules</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>Optimize for Speed</option>
            <option>Optimize for Cost</option>
            <option>Balanced</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Overflow Policy</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>Reject New Orders</option>
            <option>Reroute to Nearest</option>
            <option>Queue with Delay</option>
          </select>
        </div>
      </div>
      <GenericSaveButton label="Save Warehouse Settings" />
    </div>
  </motion.div>
);

const NotificationsSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Alert Preferences</h3>
      <div className="space-y-4">
        {[
          'New Order Placed',
          'Order Delivered',
          'Driver Delay (>15 mins)',
          'Warehouse Capacity Warning',
          'System Error Alerts'
        ].map(event => (
          <div key={event} className="flex items-center justify-between p-4 bg-surface-bg border border-border-main rounded-xl">
            <span className="font-semibold text-text-main text-sm">{event}</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-text-muted cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-brand-blue" /> Email
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-text-muted cursor-pointer">
                <input type="checkbox" className="accent-brand-blue" /> SMS
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-text-muted cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-brand-blue" /> Push
              </label>
            </div>
          </div>
        ))}
      </div>
      <GenericSaveButton label="Save Alert Preferences" />
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
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">UI Density</label>
            <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
              <option>Comfortable</option>
              <option>Compact</option>
            </select>
          </div>
        </div>
        <GenericSaveButton label="Save Appearance" />
      </div>
    </motion.div>
  );
};

const SecuritySettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Security & Access</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Require Two-Factor Auth (2FA)</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>Enabled for all Admins</option>
            <option>Optional</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Session Timeout</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>30 Minutes</option>
            <option>1 Hour</option>
            <option>4 Hours</option>
            <option>Never (Not Recommended)</option>
          </select>
        </div>
      </div>
      <div className="mt-8 border-t border-border-main pt-6">
        <h4 className="font-bold text-sm mb-4">Active Sessions</h4>
        <div className="p-4 bg-surface-bg border border-border-main rounded-xl flex justify-between items-center">
          <div>
            <p className="font-bold text-sm text-text-main">Windows 11 - Chrome</p>
            <p className="text-xs text-text-muted">IP: 192.168.1.1 - Last active: Just now</p>
          </div>
          <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">Current Session</span>
        </div>
      </div>
      <GenericSaveButton label="Save Security Settings" />
    </div>
  </motion.div>
);

const IntegrationsSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Third-Party Integrations</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <p className="font-bold text-text-main text-sm">Google Maps API</p>
            <p className="text-xs text-text-muted">Used for Live Tracking & Routing</p>
          </div>
          <div className="flex gap-2">
            <input type="password" defaultValue="AIzaSyBxxxxxxxxxxxxxxxxxxxxx" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
            <button className="bg-surface-bg border border-border-main hover:bg-gray-100 dark:hover:bg-gray-800 px-4 rounded-xl font-bold text-sm">Test</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <p className="font-bold text-text-main text-sm">Stripe API</p>
            <p className="text-xs text-text-muted">Payment Processing Gateway</p>
          </div>
          <div className="flex gap-2">
            <input type="password" defaultValue="sk_live_xxxxxxxxxxxxxxxxxxxxx" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
            <button className="bg-surface-bg border border-border-main hover:bg-gray-100 dark:hover:bg-gray-800 px-4 rounded-xl font-bold text-sm">Test</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <p className="font-bold text-text-main text-sm">Twilio</p>
            <p className="text-xs text-text-muted">SMS Notifications</p>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Not configured" className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main" />
            <button className="bg-brand-blue text-white hover:bg-blue-700 px-4 rounded-xl font-bold text-sm">Connect</button>
          </div>
        </div>
      </div>
      <GenericSaveButton label="Save Integrations" />
    </div>
  </motion.div>
);

const ApiKeysSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Developer API Keys</h3>
        <button className="bg-brand-blue text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90">
          <Plus size={16} /> Generate New Key
        </button>
      </div>
      <div className="border border-border-main rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-bg border-b border-border-main">
              <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase">Key Name</th>
              <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase">Token Preview</th>
              <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase">Created</th>
              <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border-main bg-card-bg">
              <td className="py-4 px-4 font-bold text-sm">Mobile App Sync</td>
              <td className="py-4 px-4 font-mono text-xs text-text-muted">slrros_live_29f8...a91c</td>
              <td className="py-4 px-4 font-medium text-sm text-text-muted">Jul 01, 2026</td>
              <td className="py-4 px-4 text-right">
                <button className="text-red-500 hover:text-red-600 font-bold text-sm">Revoke</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

const BackupSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8">
      <h3 className="font-bold text-lg mb-6">Backup & Restore</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Automated Backups</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>Daily at 02:00 UTC</option>
            <option>Weekly on Sunday</option>
            <option>Disabled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Retention Period</label>
          <select className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-text-main">
            <option>30 Days</option>
            <option>90 Days</option>
            <option>1 Year</option>
          </select>
        </div>
      </div>
      <div className="mt-8 border-t border-border-main pt-6 flex justify-between items-center">
        <div>
          <p className="font-bold text-text-main">Manual Snapshot</p>
          <p className="text-xs text-text-muted mt-1">Create an immediate backup of the entire database.</p>
        </div>
        <button className="bg-surface-bg border border-border-main hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
          <Database size={16} /> Trigger Backup
        </button>
      </div>
    </div>
  </motion.div>
);

const BillingSettings = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="premium-card p-8 border-t-4 border-t-brand-blue">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-bold text-xl text-text-main">Enterprise Plan</h3>
          <p className="text-sm text-text-muted mt-1">You are currently on the Enterprise Logistics Tier.</p>
        </div>
        <span className="bg-brand-blue/10 text-brand-blue font-black text-2xl px-4 py-2 rounded-xl">$499<span className="text-sm font-bold opacity-70">/mo</span></span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-surface-bg border border-border-main rounded-xl">
          <p className="text-xs font-bold text-text-muted uppercase">Next Invoice</p>
          <p className="font-bold text-lg text-text-main mt-1">Aug 01, 2026</p>
        </div>
        <div className="p-4 bg-surface-bg border border-border-main rounded-xl flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-text-muted uppercase">Payment Method</p>
            <p className="font-bold text-sm text-text-main mt-1">Visa ending in 4242</p>
          </div>
          <button className="text-brand-blue font-bold text-sm">Update</button>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:opacity-90">Manage Subscription</button>
        <button className="bg-surface-bg border border-border-main hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-2.5 rounded-xl font-bold">View Invoices</button>
      </div>
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
      <div className="mt-8 flex gap-4 text-sm font-bold text-text-muted">
        <a href="#" className="hover:text-brand-blue">Terms of Service</a>
        <span>•</span>
        <a href="#" className="hover:text-brand-blue">Privacy Policy</a>
        <span>•</span>
        <a href="#" className="hover:text-brand-blue">Documentation</a>
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
              <Route path="general" element={<GeneralSettings />} />
              <Route path="company" element={<CompanySettings />} />
              <Route path="delivery" element={<DeliverySettings />} />
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
