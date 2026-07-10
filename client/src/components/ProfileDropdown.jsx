import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Shield, Activity, LogOut, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const menuItems = [
    { label: 'My Profile', icon: User, path: '/admin/profile' },
    { label: 'Account Settings', icon: Settings, path: '/admin/settings' },
    { label: 'Security', icon: Shield, path: '/admin/settings' },
    { label: 'Activity Log', icon: Activity, path: '/admin/profile' },
    { label: 'Help Center', icon: HelpCircle, path: '#' },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center bg-surface-bg border border-border-main hover:bg-gray-100 rounded-full transition-all hover:scale-105 active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs">
          SR
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-transparent sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 right-0 w-[240px] bg-card-bg rounded-2xl shadow-2xl border border-border-main z-50 origin-top-right flex flex-col overflow-hidden p-2"
            >
              <div className="px-3 py-3 border-b border-border-main mb-1 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
                  SR
                </div>
                <div>
                  <p className="text-sm font-bold text-text-main leading-tight">Satwik Raj</p>
                  <p className="text-xs font-semibold text-text-muted">Administrator</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={i} 
                      onClick={() => { navigate(item.path); setIsOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-bg text-gray-700 transition-colors w-full text-left"
                    >
                      <Icon size={16} className="text-text-muted" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="border-t border-border-main mt-1 pt-1">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-bold">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
