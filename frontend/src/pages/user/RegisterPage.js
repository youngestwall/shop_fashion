import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { register, clearError } from '../../features/auth/authSlice';
import Loader from '../../components/ui/Loader';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [navigate, isAuthenticated, redirect]);
  
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu không khớp');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    setPasswordError('');
    return true;
  };
  
  const submitHandler = (e) => {
    e.preventDefault();
    
    if (validatePasswords()) {
      dispatch(register({ name, email, password }));
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 } }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Đăng ký tài khoản
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tạo tài khoản để mua sắm dễ dàng hơn
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {passwordError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {passwordError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={submitHandler}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Họ tên"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                color="primary"
                required
              />
            }
            label={
              <Typography variant="body2">
                Tôi đồng ý với{' '}
                <Link component={RouterLink} to="/terms">
                  điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link component={RouterLink} to="/privacy">
                  chính sách bảo mật
                </Link>
              </Typography>
            }
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !agreeTerms}
          >
            {loading ? <Loader /> : 'Đăng ký'}
          </Button>
          
          <Grid container justifyContent="center">
            <Grid item>
              <Link component={RouterLink} to={redirect ? `/login?redirect=${redirect}` : '/login'} variant="body2">
                Đã có tài khoản? Đăng nhập
              </Link>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }}>hoặc</Divider>
        
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
        >
          Đăng ký với Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
        >
          Đăng ký với Facebook
        </Button>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
