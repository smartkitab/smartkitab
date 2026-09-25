import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole = 'admin' }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center gap-4 text-[#795238]">
        <Loader2 className="w-10 h-10 animate-spin text-[#795238]" />
        <p className="text-sm font-bold tracking-wide">Verifying authorization...</p>
      </div>
    );
  }

  // If not authenticated at all, redirect to login with original location preserved
  if (!isAuthenticated) {
    const defaultMsg = location.pathname.startsWith('/sell')
      ? 'Please log in first to list books for sale or donation.'
      : 'Please log in first to access this page.';

    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: location.state?.message || defaultMsg,
        }}
        replace
      />
    );
  }

  // If user is authenticated but does not possess the required role
  if (requiredRole) {
    const isPermitted =
      user?.role === requiredRole ||
      (requiredRole === 'admin' && (user?.role === 'admin' || user?.role === 'superadmin'));

    if (!isPermitted) {
      return <Navigate to="/" state={{ from: location, unauthorized: true }} replace />;
    }
  }

  return children;
}

