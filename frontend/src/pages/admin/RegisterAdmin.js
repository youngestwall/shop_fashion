import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
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
  Divider,
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

// API base URL with fallbacks
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RegisterAdmin = () => {
  // Move ALL useState and hooks to the top
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: '' // For first admin setup
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false); // Default to false, will be updated by API
  
  // Add development mode state
  const [devMode, setDevMode] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(API_BASE_URL);
  const [apiStatus, setApiStatus] = useState({ checked: false, working: false });
  
  // Get createDevModeAdmin from context
  const { currentUser, isAdmin, registerAdmin, setupFirstAdmin, createDevModeAdmin } = useAuth();
  const navigate = useNavigate();

  // Check if this is first admin setup
  useEffect(() => {
    const checkFirstAdminSetup = async () => {
      try {
        setLoading(true);
        // Use axios for consistent error handling
        const response = await axios.get(`${API_BASE_URL}/auth/check-first-admin`);
        console.log('First admin check response:', response.data);
        setIsFirstAdmin(response.data.isFirstAdminSetup);
      } catch (error) {
        console.error("Error checking first admin setup:", error);
        // If error occurs, assume admin exists (safer default)
        setIsFirstAdmin(false);
        setError("Không thể kiểm tra trạng thái thiết lập admin. Giả định admin đã tồn tại.");
      } finally {
        setLoading(false);
      }
    };
    
    checkFirstAdminSetup();
  }, []);

  // Check API connectivity on mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/health-check`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors' // Try no-cors mode if CORS is an issue
        });
        console.log('API health check response:', response);
        setApiStatus({ checked: true, working: true });
      } catch (error) {
        console.error('API connectivity error:', error);
        setApiStatus({ checked: true, working: false });
      }
    };
    
    checkApiConnection();
  }, [apiEndpoint]);
  
  // If user is not admin and this isn't first admin setup, redirect
  // This needs to come AFTER all hooks are declared
  if (currentUser && !isAdmin() && !isFirstAdmin) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle switching to development mode
  const handleDevModeChange = (event) => {
    setDevMode(event.target.checked);
  };

  // Handle API endpoint change
  const handleApiEndpointChange = (e) => {
    setApiEndpoint(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const adminData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin'
      };
      
      console.log('Attempting to register admin with data:', { ...adminData, password: '***HIDDEN***' });
      console.log('isFirstAdmin:', isFirstAdmin);
      
      // Development mode - bypass API and simulate success
      if (devMode) {
        console.log('Using development mode - simulating successful admin creation');
        
        // Simulate a successful registration
        setTimeout(() => {
          setSuccess(`Tài khoản admin "${formData.name}" đã được tạo (CHẾ ĐỘ PHÁT TRIỂN)`);
          
          // Simulate storing a token
          localStorage.setItem('authToken', 'dev-mode-token-123456');
          localStorage.setItem('devModeAdmin', JSON.stringify({
            id: 'dev-admin-id',
            name: formData.name,
            email: formData.email,
            role: 'admin'
          }));
          
          setLoading(false);
          
          // Redirect after a delay
          setTimeout(() => {
            navigate('/admin/login');
          }, 1500);
        }, 1000);
        
        return;
      }
      
      // Regular API flow for first admin
      if (isFirstAdmin) {
        if (!formData.secretKey) {
          setError('Khóa bí mật là bắt buộc để thiết lập tài khoản admin đầu tiên');
          setLoading(false);
          return;
        }
        
        try {
          console.log(`Sending setup-first-admin request to: ${apiEndpoint}/auth/setup-first-admin`);
          
          // Use axios with proper error handling
          const response = await axios.post(`${apiEndpoint}/auth/setup-first-admin`, {
            ...adminData,
            secretKey: formData.secretKey
          });
          
          console.log('Setup first admin response:', response.data);
          
          if (response.data.success) {
            setSuccess('Tài khoản admin đầu tiên đã được tạo thành công!');
            
            // Store token if returned
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token);
              axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            
            // Redirect after a delay
            setTimeout(() => {
              navigate('/admin/login');
            }, 2000);
          } else {
            throw new Error(response.data.message || 'Lỗi không xác định');
          }
        } catch (error) {
          console.error('Error setting up first admin:', error);
          
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            throw new Error(error.response.data.message || 'Lỗi thiết lập tài khoản admin');
          } else {
            throw error;
          }
        }
      } else {
        // Regular admin creation by existing admin
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            throw new Error('❌ BẠN CHƯA ĐĂNG NHẬP ADMIN!\n\n💡 Hãy bấm nút "Đăng nhập nhanh Admin" ở dưới form, hoặc đăng nhập tại /admin/login trước khi đăng ký admin mới.');
          }
          
          console.log('Sending register-admin request with token:', token.substring(0, 20) + '...');
          
          const response = await axios.post(`${API_BASE_URL}/auth/register-admin`, adminData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Register admin response:', response.data);
          
          if (response.data.success) {
            setSuccess('Tài khoản admin mới đã được tạo thành công!');
            
            // Clear form
            setFormData({
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              secretKey: ''
            });
          } else {
            throw new Error(response.data.message || 'Đăng ký thất bại');
          }
        } catch (error) {
          console.error('Error registering admin:', error);
          
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            
            if (error.response.status === 401) {
              throw new Error('❌ TOKEN HẾT HẠN!\n\n💡 Hãy bấm nút "Đăng nhập nhanh Admin" để lấy token mới.');
            } else if (error.response.status === 403) {
              throw new Error('❌ KHÔNG ĐỦ QUYỀN!\n\nBạn không có quyền tạo admin mới. Cần đăng nhập bằng tài khoản admin.');
            } else if (error.response.status === 400) {
              throw new Error(error.response.data.message || 'Dữ liệu không hợp lệ');
            }
          }
          
          throw new Error(error.message || 'Lỗi đăng ký tài khoản admin');
        }
      }
      
      setLoading(false);
      
    } catch (err) {
      setLoading(false);
      setError(`Đã xảy ra lỗi: ${err.message || 'Lỗi không xác định'}`);
      console.error('Registration error details:', err);
    }
  };

  // Create a direct admin function that bypasses API
  const handleDirectAdminCreation = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use the dev mode admin creation
      await createDevModeAdmin();
      
      setSuccess('Tài khoản Dev Admin đã được tạo trực tiếp! Bạn có thể đăng nhập ngay.');
      
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
      
    } catch (error) {
      setError('Không thể tạo tài khoản Dev Admin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick admin login function
  const handleQuickAdminLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Attempting quick admin login...');
      
      const response = await axios.post(`${API_BASE_URL}/auth/admin-login`, {
        email: 'admin@gmail.com',
        password: 'admin123'
      });
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setSuccess('Đăng nhập admin thành công! Bây giờ bạn có thể đăng ký admin mới.');
        
        // Refresh page to update currentUser
        window.location.reload();
      }
    } catch (error) {
      console.error('Quick login failed:', error);
      setError('Đăng nhập nhanh thất bại: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {isFirstAdmin ? 'Thiết lập tài khoản Admin đầu tiên' : 'Đăng ký tài khoản Admin mới'}
        </Typography>
        <Typography color="textSecondary" align="center" sx={{ mb: 3 }}>
          {isFirstAdmin 
            ? 'Tạo tài khoản quản trị viên đầu tiên cho hệ thống' 
            : 'Thêm quản trị viên mới vào hệ thống (Cần đăng nhập admin trước)'}
        </Typography>
        
        {!isFirstAdmin && !currentUser && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="error">
              ⚠️ CẦN ĐĂNG NHẬP ADMIN TRƯỚC KHI ĐĂNG KÝ
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Để tạo admin mới, bạn phải đăng nhập với tài khoản admin hiện có:
            </Typography>
            <Typography variant="body2">
              💡 <strong>Cách nhanh nhất</strong>: Bấm nút <strong>"Đăng nhập nhanh Admin"</strong> bên dưới
            </Typography>
            <Typography variant="body2">
              🔗 Hoặc đăng nhập tại{' '}
              <Button 
                variant="text" 
                size="small" 
                onClick={() => navigate('/admin/login')}
                sx={{ textDecoration: 'underline' }}
              >
                /admin/login
              </Button>
            </Typography>
            <Typography variant="body2">
              🛠️ Hoặc bật <strong>"Chế độ phát triển"</strong> để bỏ qua yêu cầu này
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Show backend connection status */}
      {loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Đang kết nối với máy chủ...
        </Alert>
      )}

      {/* API Status Indicator */}
      {apiStatus.checked && !devMode && (
        <Alert severity={apiStatus.working ? "success" : "warning"} sx={{ mb: 3 }}>
          {apiStatus.working 
            ? `API đã sẵn sàng: ${apiEndpoint}` 
            : `Cảnh báo: Không thể kết nối tới API: ${apiEndpoint}`}
        </Alert>
      )}

      {/* Development Mode Toggle */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FormControlLabel
          control={<Switch checked={devMode} onChange={handleDevModeChange} />}
          label="Chế độ phát triển (bỏ qua API)"
        />
        
        {devMode && (
          <Typography variant="caption" color="text.secondary">
            Trong chế độ này, hệ thống sẽ giả lập thành công mà không gọi API
          </Typography>
        )}
      </Box>

      {/* API Endpoint Selection */}
      {!devMode && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Địa chỉ API</InputLabel>
          <Select
            value={apiEndpoint}
            onChange={handleApiEndpointChange}
            label="Địa chỉ API"
          >
            <MenuItem value="http://localhost:5000/api">localhost:5000</MenuItem>
            <MenuItem value="http://localhost:3000/api">localhost:3000</MenuItem>
            <MenuItem value="http://localhost:8000/api">localhost:8000</MenuItem>
            <MenuItem value="https://your-production-api.com/api">Production API</MenuItem>
          </Select>
        </FormControl>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Họ tên"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Mật khẩu"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleInputChange}
                required
                helperText="Mật khẩu phải có ít nhất 6 ký tự"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            {isFirstAdmin && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Bảo mật bổ sung
                </Typography>
                <TextField
                  label="Khóa bí mật"
                  name="secretKey"
                  type="password"
                  fullWidth
                  value={formData.secretKey}
                  onChange={handleInputChange}
                  required={!devMode} // Not required in dev mode
                  helperText={
                    devMode 
                      ? "Bỏ qua trong chế độ phát triển" 
                      : "Nhập khóa bí mật được cung cấp (thường là 'admin123' hoặc được cấu hình trong backend)"
                  }
                  disabled={devMode}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Đăng ký Admin'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Quick Admin Login and Dev Actions */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        {!isFirstAdmin && !currentUser && (
          <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
            <Typography variant="subtitle2" gutterBottom>
              🎯 <strong>GIẢI PHÁP CHO LỖI ĐĂNG KÝ ADMIN:</strong>
            </Typography>
            <Typography variant="body2">
              1. Bấm nút <strong>"Đăng nhập nhanh Admin"</strong> bên dưới
            </Typography>
            <Typography variant="body2">
              2. Sau khi đăng nhập thành công, điền form và bấm "Đăng ký Admin"
            </Typography>
          </Alert>
        )}
        
        {!isFirstAdmin && !currentUser && (
          <Button
            onClick={handleQuickAdminLogin}
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 2, mr: 2, minWidth: 280 }}
          >
            {loading ? <CircularProgress size={20} /> : '🚀 Đăng nhập nhanh Admin (admin@gmail.com)'}
          </Button>
        )}
        
        <Button
          onClick={handleDirectAdminCreation}
          variant="outlined"
          color="warning"
          size="large"
          disabled={loading}
          sx={{ mt: 2, minWidth: 280 }}
        >
          {loading ? <CircularProgress size={20} /> : '🛠️ Tạo Dev Admin (Bỏ qua API)'}
        </Button>
      </Box>

      {/* Error message */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Success message */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      {/* Display connection information in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Thông tin kết nối API:
          </Typography>
          <Typography variant="body2">API URL: {apiEndpoint}</Typography>
          <Typography variant="body2" color={apiStatus.working ? "success.main" : "error.main"}>
            Trạng thái: {apiStatus.working ? "Kết nối OK" : "Không kết nối được"}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            Mẹo: Đảm bảo rằng máy chủ backend của bạn đang chạy và API endpoint chính xác.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default RegisterAdmin;
