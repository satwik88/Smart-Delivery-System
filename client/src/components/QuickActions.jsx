import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, UserPlus, Car, MapPin, FileText, Download } from 'lucide-react';

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { label: 'Create Order', icon: Package, color: 'text-brand-blue' },
    { label: 'Add Driver', icon: Car, color: 'text-purple-500' },
    { label: 'Add Customer', icon: UserPlus, color: 'text-green-500' },
    { label: 'Add Warehouse', icon: MapPin, color: 'text-orange-500' },
    { label: 'Generate Report', icon: FileText, color: 'text-pink-500' },
    { label: 'Export Data', icon: Download, color: 'text-text-muted' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-blue text-white w-10 h-10 rounded-full shadow-lg shadow-brand-blue/30 flex items-center justify-center hover:bg-brand-dark transition-all hover:scale-105 active:scale-95"
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={24} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 right-0 w-[240px] bg-card-bg rounded-2xl shadow-2xl border border-border-main p-2 z-50 origin-top-right flex flex-col gap-1"
            >
              <div className="px-3 py-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Quick Actions</div>
              {actions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button key={i} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-bg transition-colors group">
                    <div className={`w-8 h-8 rounded-lg bg-surface-bg group-hover:bg-card-bg border border-transparent group-hover:border-border-main shadow-sm flex items-center justify-center ${action.color}`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{action.label}</span>
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActions;
