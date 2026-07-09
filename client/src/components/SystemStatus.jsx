import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Server, MapPin, Bell } from 'lucide-react';

const SystemStatus = ({ isOpen, onClose }) => {
  const statuses = [
    { label: 'Backend Server', status: 'Operational', icon: Server, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Database', status: 'Operational', icon: Database, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'API Gateway', status: 'Operational', icon: Activity, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'GPS Tracking', status: 'Degraded', icon: MapPin, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { label: 'Notifications', status: 'Operational', icon: Bell, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm sm:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-4 sm:right-24 w-[320px] bg-card-bg rounded-2xl shadow-2xl border border-border-main p-5 z-50 origin-top-right"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-text-main">System Status</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Online</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {statuses.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg} ${s.color}`}>
                        <Icon size={14} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{s.label}</span>
                    </div>
                    <span className={`text-xs font-bold uppercase ${s.status === 'Operational' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {s.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SystemStatus;
