import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const DriverGuard = () => {
  const isAuth = !!localStorage.getItem('driverToken');

  if (!isAuth) {
    return <Navigate to="/driver/login" replace />;
  }

  return <Outlet />;
};

export default DriverGuard;
