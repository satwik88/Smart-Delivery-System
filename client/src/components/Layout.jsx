import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Network, Map, Package, Database, ArrowLeft, Moon, Sun, MapPin, Truck } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  // Theme toggle (Native Dark)
  const [theme, setTheme] = useState(localStorage.getItem('slrros_theme') || 'light');

  useEffect(() => {
    // Admin is natively dark. If preference is 'light', we add 'theme-inverted' to make it light.
    if (theme === 'light') document.body.classList.add('theme-inverted');
    else document.body.classList.remove('theme-inverted');
    localStorage.setItem('slrros_theme', theme);
  }, [theme]);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Live Tracking', icon: MapPin },
    { path: '/admin/routing', label: 'Active Routes', icon: Map },
    { path: '/admin/network', label: 'Logistics Network', icon: Network },
    { path: '/admin/resources', label: 'Fleet Management', icon: Truck },
    { path: '/admin/sorting', label: 'Order Analytics', icon: Database },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neon-blue">TRACK</h1>
          <p className="text-xs text-slate-400 mt-1">Global Logistics Platform</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-neon-blue/20 text-neon-blue' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-700 space-y-4">
          <Link to="/" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-neon-blue transition-colors w-full bg-slate-800/50 hover:bg-slate-700/50 py-2 rounded-lg border border-slate-700/50">
            <ArrowLeft size={16} />
            Back to Tracking
          </Link>
          <div className="text-xs text-slate-500 text-center">
            TRACK Logistics <br/> v2.0
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm flex justify-between items-center px-8 shrink-0">
          <h2 className="text-xl font-semibold text-slate-100">
            {navItems.find(i => i.path === location.pathname)?.label || 'TRACK Dashboard'}
          </h2>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="p-2 text-slate-400 hover:text-neon-blue transition-colors rounded-full hover:bg-slate-700/50"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>
        
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-blue to-transparent" />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
