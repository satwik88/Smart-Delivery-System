import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeToasts, setActiveToasts] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    fetchNotifications();

    const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: { token }
    });

    newSocket.on('system_alert', (notification) => {
        // Add to persistent list
        setNotifications(prev => [notification, ...prev]);
        // Add to active toasts to show on screen
        const toastId = Date.now();
        setActiveToasts(prev => [...prev, { ...notification, toastId }]);
        
        // Auto-remove toast after 5s
        setTimeout(() => {
            setActiveToasts(prev => prev.filter(t => t.toastId !== toastId));
        }, 5000);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const fetchNotifications = async () => {
      try {
          const res = await api.get('/notifications');
          setNotifications(res.data);
      } catch (err) {
          console.error(err);
      }
  };

  const markAsRead = async (id) => {
      try {
          await api.put(`/notifications/${id}/read`);
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      } catch (err) {
          console.error(err);
      }
  };

  const markAllAsRead = async () => {
      // In a real app, hit a bulk update API. Here we just update state for simplicity or loop.
      notifications.filter(n => !n.is_read).forEach(n => markAsRead(n.id));
  };

  const removeToast = (toastId) => {
      setActiveToasts(prev => prev.filter(t => t.toastId !== toastId));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
          <AnimatePresence>
              {activeToasts.map(toast => (
                  <motion.div
                      key={toast.toastId}
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.2 } }}
                      className="pointer-events-auto bg-card-bg border border-border-main shadow-2xl rounded-2xl p-4 flex gap-4 items-start relative overflow-hidden"
                  >
                      {/* Left border accent based on type */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${toast.type === 'SUCCESS' ? 'bg-green-500' : toast.type === 'WARNING' ? 'bg-yellow-500' : 'bg-brand-blue'}`}></div>
                      
                      <div className="mt-1">
                          {toast.type === 'SUCCESS' ? <CheckCircle className="text-green-500" size={20} /> :
                           toast.type === 'WARNING' ? <AlertCircle className="text-yellow-500" size={20} /> :
                           <Info className="text-brand-blue" size={20} />}
                      </div>
                      
                      <div className="flex-1">
                          <h4 className="font-bold text-sm text-text-main mb-0.5">{toast.title}</h4>
                          <p className="text-xs text-text-muted font-medium leading-relaxed">{toast.message}</p>
                      </div>
                      
                      <button onClick={() => removeToast(toast.toastId)} className="text-text-muted hover:text-text-main">
                          <X size={16} />
                      </button>
                  </motion.div>
              ))}
          </AnimatePresence>
      </div>

    </NotificationContext.Provider>
  );
};
