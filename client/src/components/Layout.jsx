import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  LayoutDashboard, 
  Search, 
  Settings, 
  Users, 
  Car, 
  BarChart3,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  CreditCard
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';
import CommandPalette from './CommandPalette';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import AIAssistantWidget from './AIAssistantWidget';

const Layout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Orders', icon: Package },
    { path: '/admin/drivers', label: 'Drivers', icon: Car },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/billing', label: 'Billing', icon: CreditCard },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-surface-bg flex font-sans text-text-main overflow-hidden transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card-bg border-r border-border-main flex flex-col transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header / Logo */}
        <div className="h-20 flex items-center px-6 shrink-0 border-b border-border-main justify-between lg:justify-start">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-brand-blue p-2.5 rounded-xl text-white shadow-lg shadow-brand-blue/30">
              <Package size={20} strokeWidth={2.5} />
            </div>
            <div className="leading-tight flex flex-col justify-center">
              <span className="font-black text-brand-blue text-xl tracking-tight leading-none">TRACK</span>
              <span className="font-bold text-text-muted text-[10px] uppercase tracking-widest mt-0.5">Logistics</span>
            </div>
          </Link>
          <button className="lg:hidden text-text-muted hover:text-text-main" onClick={toggleMobileMenu}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-3">Main Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                  isActive 
                    ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" 
                    : "text-text-muted hover:text-text-main hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-main shrink-0">
          <button 
            onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin';
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut size={18} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-card-bg border-b border-border-main flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-text-muted hover:text-text-main rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>

            <button 
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center gap-3 px-4 h-10 w-64 bg-surface-bg border border-border-main hover:border-gray-300 rounded-lg text-text-muted transition-colors"
            >
              <Search size={16} />
              <span className="text-sm font-medium">Search anything... (Ctrl+K)</span>
            </button>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>
            
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsCommandOpen(true)}
            >
              <Search size={18} strokeWidth={2} />
            </button>

            <NotificationDropdown />
            <div className="w-px h-6 bg-border-main hidden md:block"></div>
            <ProfileDropdown />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-10 relative">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <AIAssistantWidget />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  );
};

export default Layout;
