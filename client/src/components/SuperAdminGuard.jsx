import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SuperAdminGuard = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('superAdminToken');
    // For a real app, you would decode the JWT to check the role or hit /api/auth/me
    // Since we handle login navigation from AdminLoginPage, just checking token existence is a simplistic guard
    if (token) {
        setIsSuperAdmin(true);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default SuperAdminGuard;
