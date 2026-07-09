import React, { useState } from 'react';
import { User, Mail, Phone, Building, Shield, Key, MapPin, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-3xl font-black text-gray-900">My Profile</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('personal')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-3 ${activeTab === 'personal' ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <User size={18} /> Personal Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-3 ${activeTab === 'security' ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Shield size={18} /> Security
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {activeTab === 'personal' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Avatar Header */}
              <div className="premium-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-black text-3xl">
                    SR
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-brand-blue opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <Edit3 size={14} />
                  </button>
                </div>
                <div className="text-center sm:text-left flex-1 mt-2">
                  <h2 className="text-2xl font-bold text-gray-900">Satwik Raj</h2>
                  <p className="text-gray-500 font-medium">Administrator</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="premium-card p-8">
                <h3 className="font-bold text-lg mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" defaultValue="Satwik Raj" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="email" defaultValue="admin@smartdelivery.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Company / Branch</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" defaultValue="Headquarters" disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-dark transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Password */}
              <div className="premium-card p-8">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Key size={20} className="text-gray-400" /> Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all max-w-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all max-w-sm" />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Login History */}
              <div className="premium-card p-8">
                <h3 className="font-bold text-lg mb-6">Recent Login History</h3>
                <div className="space-y-4">
                  {[
                    { ip: '192.168.1.1', device: 'Chrome on Mac OS', time: 'Just now', loc: 'San Francisco, US' },
                    { ip: '192.168.1.1', device: 'Safari on iPhone 13', time: '2 days ago', loc: 'San Francisco, US' },
                  ].map((log, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{log.device}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={10} /> {log.loc} • {log.ip}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
};

export default AdminProfile;
