import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Shield, Key, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState({ full_name: '', email: '', username: '' });
  const [loading, setLoading] = useState(true);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Status messages
  const [personalStatus, setPersonalStatus] = useState('');
  const [securityStatus, setSecurityStatus] = useState('');

  useEffect(() => {
    api.get('/settings/profile')
      .then(res => {
        setProfile({
          full_name: res.data.full_name || '',
          email: res.data.email || '',
          username: res.data.username || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile', err);
        setLoading(false);
      });
  }, []);

  const handlePersonalSave = async () => {
    try {
      setPersonalStatus('Saving...');
      await api.put('/settings/profile', {
        full_name: profile.full_name,
        email: profile.email
      });
      setPersonalStatus('Saved successfully!');
      setTimeout(() => setPersonalStatus(''), 3000);
    } catch (err) {
      setPersonalStatus('Error saving profile');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) return;
    try {
      setSecurityStatus('Updating...');
      await api.put('/settings/password', { currentPassword, newPassword });
      setSecurityStatus('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSecurityStatus(''), 3000);
    } catch (err) {
      setSecurityStatus(err.response?.data?.error || 'Error updating password');
    }
  };

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-3xl font-black text-text-main">My Profile</h1>
        <p className="text-text-muted font-medium mt-1">Manage your personal information and security preferences.</p>
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
                    {profile.full_name ? profile.full_name.substring(0, 2).toUpperCase() : profile.username.substring(0, 2).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-card-bg rounded-full shadow-md border border-border-main text-text-muted hover:text-brand-blue opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <Edit3 size={14} />
                  </button>
                </div>
                <div className="text-center sm:text-left flex-1 mt-2">
                  <h2 className="text-2xl font-bold text-text-main">{profile.full_name || profile.username}</h2>
                  <p className="text-text-muted font-medium">@{profile.username}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="premium-card p-8">
                <h3 className="font-bold text-lg mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input 
                        type="text" 
                        value={profile.full_name} 
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="w-full bg-surface-bg border border-border-main rounded-xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-card-bg transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input 
                        type="email" 
                        value={profile.email} 
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full bg-surface-bg border border-border-main rounded-xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-card-bg transition-all" 
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end items-center gap-4">
                  {personalStatus && <span className="text-sm font-semibold text-brand-blue">{personalStatus}</span>}
                  <button 
                    onClick={handlePersonalSave}
                    className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-dark transition-colors"
                  >
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
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Key size={20} className="text-text-muted" /> Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Current Password</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-card-bg transition-all max-w-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-surface-bg border border-border-main rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-card-bg transition-all max-w-sm" 
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <button 
                    onClick={handlePasswordUpdate}
                    className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-colors"
                  >
                    Update Password
                  </button>
                  {securityStatus && <span className="text-sm font-semibold text-gray-700">{securityStatus}</span>}
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
