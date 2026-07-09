import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, AlertTriangle, DollarSign, CheckCircle2, MoreHorizontal } from 'lucide-react';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const initialNotifications = [
    { id: 1, title: 'Delivery Delayed', desc: 'TRK-89231 is delayed due to traffic.', type: 'alert', time: '5m ago', read: false },
    { id: 2, title: 'New Order Received', desc: 'TRK-90012 from John Doe.', type: 'order', time: '12m ago', read: false },
    { id: 3, title: 'Payment Confirmed', desc: '$450.00 settled for batch #82.', type: 'payment', time: '1h ago', read: true },
    { id: 4, title: 'Driver Online', desc: 'Sarah Smith started her shift.', type: 'success', time: '2h ago', read: true },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  
  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center"><AlertTriangle size={14}/></div>;
      case 'order': return <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center"><Package size={14}/></div>;
      case 'payment': return <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center"><DollarSign size={14}/></div>;
      case 'success': return <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center"><CheckCircle2 size={14}/></div>;
      default: return <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"><Bell size={14}/></div>;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-all relative hover:scale-105 active:scale-95"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
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
              className="absolute top-14 right-0 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 origin-top-right flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs font-bold text-brand-blue hover:underline">Mark all read</button>
                  )}
                </div>
              </div>
              
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No new notifications</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-brand-blue/5' : ''}`}>
                        {getIcon(notif.type)}
                        <div className="flex-1">
                          <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{notif.title}</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5 leading-snug">{notif.desc}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">{notif.time}</p>
                        </div>
                        <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <button className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">View All Notifications</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
