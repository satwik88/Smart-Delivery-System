import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import CustomerTrackingPage from './pages/CustomerTrackingPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerGuard from './components/CustomerGuard';
import CustomerPortalModule from './views/CustomerPortalModule';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminGuard from './components/AdminGuard';
import SuperAdminGuard from './components/SuperAdminGuard';
import SuperAdminDashboard from './views/SuperAdminDashboard';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import FinancialModule from './views/FinancialModule';
import DispatchRulesModule from './views/DispatchRulesModule';
import OrdersTrackingModule from './views/OrdersTrackingModule';
import FleetManagementModule from './views/FleetManagementModule';
import InventoryManagementModule from './views/InventoryManagementModule';
import AIOperationsModule from './views/AIOperationsModule';
import BusinessIntelligenceModule from './views/BusinessIntelligenceModule';
import DeveloperSettings from './views/DeveloperSettings';
import MarketplaceModule from './views/MarketplaceModule';
import { NotificationProvider } from './context/NotificationContext';

// New Premium Admin Pages
import AdminDrivers from './pages/AdminDrivers';
import AdminCustomers from './pages/AdminCustomers';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';
import AdminAnalytics from './pages/AdminAnalytics';

import DriverGuard from './components/DriverGuard';
import DriverLoginPage from './pages/DriverLoginPage';
import DriverDashboardPage from './pages/DriverDashboardPage';

// Legacy Admin Pages repurposed

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Phase 1: Public Landing Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Phase 2: Customer Tracking Route */}
        <Route path="/track" element={<CustomerTrackingPage />} />

        {/* Phase 12: Customer Portal Routes */}
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/customer" element={<CustomerGuard />}>
          <Route path="portal" element={<CustomerPortalModule />} />
        </Route>

        {/* Driver Portal Routes */}
        <Route path="/driver/login" element={<DriverLoginPage />} />
        <Route path="/driver" element={<DriverGuard />}>
          <Route path="dashboard" element={<DriverDashboardPage />} />
        </Route>
        
        {/* Phase 3: Admin Routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/register" element={<AdminRegisterPage />} />
        
        {/* Phase 13: Super Admin Routes */}
        <Route path="/superadmin" element={<SuperAdminGuard />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={
              <NotificationProvider>
                  <Layout />
              </NotificationProvider>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<OrdersTrackingModule />} />
            <Route path="fleet" element={<FleetManagementModule />} />
            <Route path="inventory" element={<InventoryManagementModule />} />
            <Route path="ai-ops" element={<AIOperationsModule />} />
            
            {/* Premium Modules */}
            <Route path="drivers" element={<AdminDrivers />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="analytics" element={<BusinessIntelligenceModule />} />
            <Route path="finance" element={<FinancialModule />} />
            <Route path="developer" element={<DeveloperSettings />} />
            <Route path="marketplace" element={<MarketplaceModule />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="settings/*" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="finance/ledger" element={<FinancialModule />} />
            
            {/* Phase 14: Dispatch Rules */}
            <Route path="dispatch-rules" element={<DispatchRulesModule />} />
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
