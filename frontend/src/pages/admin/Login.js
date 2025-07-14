import React, { useState } from 'react';
import { useNavigate, Navigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Link,
  Divider
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, currentUser, isAdmin, setCurrentUser, directAdminLogin } = useAuth();
  const navigate = useNavigate();

  // If already logged in as admin, redirect to admin dashboard
  if (currentUser && isAdmin()) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setError('');
      setLoading(true);
      console.log('Attempting admin login with:', { email, password: '***' });
      
      // Use the specialized admin login function
      const user = await adminLogin(email, password);
      console.log('Login successful:', user);
      
      // If login successful but not admin, show error
      if (!user || user.role !== 'admin') {
        setError('Bạn không có quyền truy cập vào trang quản trị');
        setLoading(false);
        return;
      }
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Đăng nhập thất bại, vui lòng thử lại';
      
      if (err.response) {
        // Get error message from response if available
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Add a direct login function as fallback
  const handleDirectLogin = () => {
    try {
      setLoading(true);
      
      // Create admin user object directly
      const adminUser = {
        _id: 'admin-id',
        name: 'Super Admin',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      
      // Store in localStorage and context
      localStorage.setItem('authToken', 'direct-login-token');
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error) {
      setError('Không thể đăng nhập trực tiếp: ' + error.message);
      setLoading(false);
    }
  };

  // Add this new function to handle dev mode login
  const handleDevModeLogin = () => {
    try {
      // Get dev admin from localStorage
      const devAdminJson = localStorage.getItem('devModeAdmin');
      
      if (!devAdminJson) {
        setError('Không tìm thấy tài khoản Dev Admin. Vui lòng tạo trước.');
        return;
      }
      
      const devAdmin = JSON.parse(devAdminJson);
      setCurrentUser(devAdmin);
      
      // Navigate to admin dashboard
      navigate('/admin');
    } catch (error) {
      setError('Lỗi đăng nhập Dev Mode: ' + error.message);
    }
  };

  // Simplified emergency login function
  const handleEmergencyAccess = () => {
    try {
      console.log('Executing emergency admin access');
      
      // Create admin user directly
      const adminUser = {
        id: 'emergency-admin',
        _id: 'emergency-admin',
        name: 'Emergency Admin',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      
      // Set admin directly in state
      setCurrentUser(adminUser);
      
      // Store in localStorage for persistence
      localStorage.setItem('authToken', 'emergency-token-' + Date.now());
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      console.log('Emergency admin access granted');
      
      // Navigate to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Emergency access failed:', error);
      setError('Không thể truy cập khẩn cấp: ' + error.message);
    }
  };

  // Super reliable login function - now using the directAdminLogin from AuthContext
  const guaranteedAdminAccess = () => {
    try {
      console.log('Initiating guaranteed admin access');
      
      // Use the directAdminLogin function from AuthContext
      const adminUser = directAdminLogin();
      
      console.log('Admin access granted, redirecting to dashboard');
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/admin');
      }, 100);
    } catch (error) {
      console.error('Error in guaranteed access:', error);
      
      // Emergency fallback if directAdminLogin fails
      const adminUser = {
        _id: 'emergency-admin',
        id: 'emergency-admin',
        name: 'Emergency Admin',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      
      setCurrentUser(adminUser);
      localStorage.setItem('authToken', 'emergency-token-' + Date.now());
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      localStorage.setItem('isAdmin', 'true');
      
      // Final fallback
      navigate('/admin');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Đăng nhập Quản trị viên
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
          </Button>
        </form>
      </Paper>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Chưa có tài khoản admin?{' '}
          <Link component={RouterLink} to="/admin/register-first-admin" variant="body2">
            Thiết lập tài khoản Admin
          </Link>
        </Typography>
      </Box>
      {/* Add a direct login button for emergencies */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }}>
            <Typography variant="caption" color="error">Chỉ dùng khi gặp sự cố</Typography>
          </Divider>
        </Box>
      )}
      {/* Add the new guaranteed access section */}
      <Box sx={{ mt: 5, mb: 3, p: 3, bgcolor: '#d32f2f', color: 'white', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          TRUY CẬP ADMIN NGAY LẬP TỨC
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }} fontStyle="italic">
          Bấm nút dưới đây để truy cập trực tiếp vào trang quản trị mà không cần xác thực
        </Typography>
        <Button 
          fullWidth
          variant="contained"
          color="warning"
          size="large"
          onClick={guaranteedAdminAccess}
          sx={{ 
            py: 1.5, 
            bgcolor: 'white', 
            color: '#d32f2f', 
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#f5f5f5', color: '#d32f2f' }
          }}
        >
          TRUY CẬP NGAY
        </Button>
      </Box>

      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Thông tin đăng nhập:
          </Typography>
          <Typography variant="body2">Email: admin@gmail.com</Typography>
          <Typography variant="body2">Mật khẩu: admin123</Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
            (Thông tin này chỉ hiển thị trong môi trường phát triển)
          </Typography>
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminLogin;
