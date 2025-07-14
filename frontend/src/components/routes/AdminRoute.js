import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();

  console.log('AdminRoute - Current user:', currentUser);
  console.log('AdminRoute - Is admin:', isAdmin());

  // Check localStorage as fallback
  const adminUserFromStorage = localStorage.getItem('adminUser');
  const isAdminFromStorage = localStorage.getItem('isAdmin') === 'true';
  
  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Alternative admin check for better reliability
  const isActuallyAdmin = 
    (currentUser && currentUser.role === 'admin') || 
    (adminUserFromStorage && JSON.parse(adminUserFromStorage).role === 'admin') ||
    isAdminFromStorage;

  console.log('AdminRoute - Is actually admin:', isActuallyAdmin);

  // If not admin, redirect to login
  if (!isActuallyAdmin) {
    console.log('AdminRoute - Redirecting to login');
    return <Navigate to="/admin/login" />;
  }

  // If admin, render the children
  console.log('AdminRoute - Rendering admin content');
  return children;
};

export default AdminRoute;
