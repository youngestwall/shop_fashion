import React from 'react';
import { Button, Box, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AdminPanelSettings } from '@mui/icons-material';

const AdminRegistrationLink = ({ variant = 'button' }) => {
  if (variant === 'button') {
    return (
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          component={RouterLink}
          to="/admin/register-first-admin"
          variant="contained"
          color="primary"
          startIcon={<AdminPanelSettings />}
        >
          Thiết lập tài khoản Admin
        </Button>
      </Box>
    );
  } else {
    return (
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body1">
          <Link component={RouterLink} to="/admin/register-first-admin">
            Thiết lập tài khoản Admin
          </Link>
        </Typography>
      </Box>
    );
  }
};

export default AdminRegistrationLink;
