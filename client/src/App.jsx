import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import CustomerTrackingPage from './pages/CustomerTrackingPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminGuard from './components/AdminGuard';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import OrdersTrackingModule from './views/OrdersTrackingModule';

// New Premium Admin Pages
import AdminDrivers from './pages/AdminDrivers';
import AdminCustomers from './pages/AdminCustomers';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';

// Legacy Admin Pages repurposed

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Phase 1: Public Landing Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Phase 2: Customer Tracking Route */}
        <Route path="/track" element={<CustomerTrackingPage />} />
        
        {/* Phase 3: Admin Routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<OrdersTrackingModule />} />
            
            {/* Premium Modules */}
            <Route path="drivers" element={<AdminDrivers />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings/*" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
