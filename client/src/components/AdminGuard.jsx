import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminGuard = () => {
  const isAuth = sessionStorage.getItem('adminAuth') === 'true';

  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
