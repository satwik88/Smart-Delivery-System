import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  LayoutDashboard, 
  Search, 
  Bell, 
  Settings, 
  Users, 
  Car, 
  BarChart3,
  User,
  Moon,
  Sun
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';
import CommandPalette from './CommandPalette';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SystemStatus from './SystemStatus';
import QuickActions from './QuickActions';

const Layout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Orders', icon: Package },
    { path: '/admin/drivers', label: 'Drivers', icon: Car },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-sans text-text-main">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-8 py-5 bg-card-bg shadow-[0_2px_12px_rgba(0,0,0,0.03)] shrink-0 z-20 relative">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-brand-blue p-2.5 rounded-2xl text-white shadow-lg shadow-brand-blue/30">
            <Package size={24} strokeWidth={2.5} />
          </div>
          <div className="leading-tight flex flex-col justify-center">
            <span className="font-black text-brand-blue text-xl tracking-tight leading-none">TRACK</span>
            <span className="font-bold text-text-muted text-xs uppercase tracking-widest mt-0.5">Logistics</span>
          </div>
        </div>
        
        {/* Nav Links */}
        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            // Check active based on base path or exact match
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                  isActive 
                    ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" 
                    : "text-text-muted hover:text-text-main hover:bg-gray-100/80"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-surface-bg border border-border-main hover:bg-gray-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 rounded-full text-text-muted dark:text-text-muted transition-colors mr-2"
          >
            <Search size={16} />
            <span className="text-sm font-medium">Search...</span>
            <kbd className="px-1.5 py-0.5 bg-card-bg dark:bg-slate-900 border border-border-main dark:border-slate-700 rounded text-[10px] font-bold shadow-sm">CTRL K</kbd>
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-3 bg-surface-bg dark:bg-slate-800 border border-border-main hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-text-muted hover:text-text-main transition-colors hover:scale-105 transform active:scale-95 duration-200"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
          </button>
          
          <button 
            className="md:hidden p-3 bg-surface-bg border border-border-main hover:bg-gray-100 rounded-full text-text-muted hover:text-text-main transition-colors hover:scale-105 transform active:scale-95 duration-200"
            onClick={() => setIsCommandOpen(true)}
          >
            <Search size={20} strokeWidth={2} />
          </button>

          <button 
            onClick={() => setIsStatusOpen(true)}
            className="p-3 bg-green-50 border border-green-200 hover:bg-green-100 rounded-full text-green-600 transition-colors hover:scale-105 transform active:scale-95 duration-200"
            title="System Status"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </button>

          <NotificationDropdown />
          <QuickActions />
          <ProfileDropdown />
          <SystemStatus isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} />
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
