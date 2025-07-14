import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { currentUser, loading, isAdmin } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  // If route requires admin and user is not admin, redirect to home
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
