import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const CustomerGuard = () => {
  const token = localStorage.getItem('customerToken');
  
  if (!token) {
    return <Navigate to="/customer/login" replace />;
  }

  return <Outlet />;
};

export default CustomerGuard;
