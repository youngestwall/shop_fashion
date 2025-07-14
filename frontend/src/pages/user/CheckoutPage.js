import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert,
} from '@mui/material';
import { createOrder } from '../../features/orders/orderSlice';
import { clearCart, saveShippingAddress, savePaymentMethod } from '../../features/cart/cartSlice';
import Loader from '../../components/ui/Loader';

const steps = ['Thông tin giao hàng', 'Phương thức thanh toán', 'Xác nhận đơn hàng'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { loading, error, success, order } = useSelector((state) => state.orders);
  
  const [activeStep, setActiveStep] = useState(0);
  
  // Form states
  const [shippingData, setShippingData] = useState({
    fullName: shippingAddress.fullName || user?.name || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    phone: shippingAddress.phone || '',
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethod || 'cod'
  );
  
  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500000 ? 0 : 30000; // Free shipping for orders over 500k
  const totalPrice = itemsPrice + shippingPrice;
  
  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  // Handlers
  const handleNext = () => {
    if (activeStep === 0) {
      dispatch(saveShippingAddress(shippingData));
    } else if (activeStep === 1) {
      dispatch(savePaymentMethod(selectedPaymentMethod));
    } else if (activeStep === 2) {
      // Place order
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: shippingData,
        paymentMethod: selectedPaymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      };
      
      dispatch(createOrder(orderData));
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle successful order
  if (success && order && activeStep === 3) {
    dispatch(clearCart());
    return (
      <Container sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">
            Đặt hàng thành công!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Mã đơn hàng: {order._id}
          </Typography>
          <Typography variant="body1" paragraph>
            Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </Typography>
          <Typography variant="body1" paragraph>
            Chúng tôi sẽ gửi email xác nhận kèm theo thông tin đơn hàng.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/orders/${order._id}`)}
              sx={{ mx: 1 }}
            >
              Xem chi tiết đơn hàng
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ mx: 1 }}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Thanh toán
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {activeStep === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Thông tin giao hàng
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Họ tên"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleShippingChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Thành phố/Tỉnh"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            
            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Phương thức thanh toán
                </Typography>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Chọn phương thức thanh toán</FormLabel>
                  <RadioGroup
                    name="paymentMethod"
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="cod"
                      control={<Radio />}
                      label="Thanh toán khi nhận hàng (COD)"
                    />
                    <FormControlLabel
                      value="bank_transfer"
                      control={<Radio />}
                      label="Chuyển khoản ngân hàng"
                    />
                    <FormControlLabel
                      value="momo"
                      control={<Radio />}
                      label="Ví điện tử MoMo"
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
            
            {activeStep === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Xác nhận đơn hàng
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Thông tin giao hàng:
                  </Typography>
                  <Typography variant="body2">
                    {shippingData.fullName}, {shippingData.address}, {shippingData.city}
                  </Typography>
                  <Typography variant="body2">
                    Điện thoại: {shippingData.phone}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Phương thức thanh toán:
                  </Typography>
                  <Typography variant="body2">
                    {selectedPaymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                    {selectedPaymentMethod === 'bank_transfer' && 'Chuyển khoản ngân hàng'}
                    {selectedPaymentMethod === 'momo' && 'Ví điện tử MoMo'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Các sản phẩm:
                  </Typography>
                  {cartItems.map((item) => (
                    <Box 
                      key={`${item.product}-${item.size}-${item.color}`}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      <Box>
                        <Typography variant="body2">
                          {item.name} {item.size && `- ${item.size}`} {item.color && `- ${item.color}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Số lượng: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tóm tắt đơn hàng
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Số lượng sản phẩm:</Typography>
              <Typography>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tạm tính:</Typography>
              <Typography>{itemsPrice.toLocaleString('vi-VN')}đ</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Phí vận chuyển:</Typography>
              <Typography>
                {shippingPrice > 0 ? `${shippingPrice.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Tổng cộng:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {totalPrice.toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack}>
                  Quay lại
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && (!shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.phone)) ||
                  loading
                }
                sx={{ ml: 'auto' }}
              >
                {activeStep === steps.length - 1 ? 'Đặt hàng' : 'Tiếp tục'}
              </Button>
            </Box>
            
            {loading && <Loader />}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
