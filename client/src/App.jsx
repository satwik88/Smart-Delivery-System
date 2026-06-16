import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import NetworkTopography from './views/NetworkTopography';
import DeliveryRouting from './views/DeliveryRouting';
import ResourceAllocation from './views/ResourceAllocation';
import DataSorting from './views/DataSorting';

import CustomerTrackingPage from './pages/CustomerTrackingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminGuard from './components/AdminGuard';
import OrdersTrackingModule from './views/OrdersTrackingModule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<CustomerTrackingPage />} />
        
        {/* Admin Auth Route */}
        <Route path="/admin" element={<AdminLoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="network" element={<NetworkTopography />} />
            <Route path="routing" element={<DeliveryRouting />} />
            <Route path="resources" element={<ResourceAllocation />} />
            <Route path="sorting" element={<DataSorting />} />
            <Route path="orders" element={<OrdersTrackingModule />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
