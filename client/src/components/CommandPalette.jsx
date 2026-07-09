import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, User, Car, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Mock results that would normally come from a global search API
  const getResults = () => {
    if (!query) return [];
    const q = query.toLowerCase();
    const results = [];
    
    if ('TRK-89231'.toLowerCase().includes(q) || q.includes('trk')) {
      results.push({ id: 'trk1', type: 'Order', title: 'TRK-89231', subtitle: 'In Transit to Downtown', icon: Package, link: '/track' });
    }
    if ('satwik'.includes(q) || 'raj'.includes(q)) {
      results.push({ id: 'c1', type: 'Customer', title: 'Satwik Raj', subtitle: 'Premium Member • 24 Orders', icon: User, link: '/admin/customers' });
    }
    if ('john'.includes(q) || 'driver'.includes(q)) {
      results.push({ id: 'd1', type: 'Driver', title: 'John Doe', subtitle: 'Available • Standard Truck', icon: Car, link: '/admin/drivers' });
    }
    if ('warehouse'.includes(q) || 'central'.includes(q)) {
      results.push({ id: 'w1', type: 'Warehouse', title: 'Central Hub', subtitle: 'Active • 80% Capacity', icon: MapPin, link: '/admin/network' });
    }
    
    return results;
  };

  const results = getResults();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        navigate(results[selectedIndex].link);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="bg-card-bg w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-border-main flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center px-4 py-4 border-b border-border-main relative">
                <Search className="text-text-muted mr-3" size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  placeholder="Search orders, customers, drivers..."
                  className="flex-1 text-lg font-medium text-text-main focus:outline-none placeholder:text-text-muted bg-transparent"
                />
                <div className="flex gap-1 absolute right-4">
                  <kbd className="hidden sm:inline-flex items-center justify-center px-2 h-6 text-[10px] font-bold text-text-muted bg-gray-100 rounded">ESC</kbd>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {!query ? (
                  <div className="p-6 text-center text-text-muted">
                    <Clock size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">Type to start searching...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-6 text-center text-text-muted">
                    <p className="text-sm font-medium">No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {results.map((result, index) => {
                      const Icon = result.icon;
                      const isSelected = index === selectedIndex;
                      return (
                        <div 
                          key={result.id}
                          onMouseEnter={() => setSelectedIndex(index)}
                          onClick={() => { navigate(result.link); onClose(); }}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-brand-blue/10' : 'hover:bg-surface-bg'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-brand-blue text-white' : 'bg-gray-100 text-text-muted'}`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${isSelected ? 'text-brand-blue' : 'text-text-main'}`}>{result.title}</p>
                              <p className="text-xs font-semibold text-text-muted mt-0.5">{result.type} • {result.subtitle}</p>
                            </div>
                          </div>
                          {isSelected && <ArrowRight size={16} className="text-brand-blue" />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="bg-surface-bg px-4 py-3 border-t border-border-main flex items-center gap-4 text-xs font-semibold text-text-muted">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-card-bg border border-border-main rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-card-bg border border-border-main rounded">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-card-bg border border-border-main rounded">↵</kbd> to select</span>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
