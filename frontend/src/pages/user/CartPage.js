import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  IconButton,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
} from '@mui/icons-material';
import { removeFromCart, addToCart } from '../../features/cart/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  
  // Calculate cart totals
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500000 ? 0 : 30000; // Free shipping for orders over 500k
  const totalPrice = itemsPrice + shippingPrice;
  
  const handleRemoveFromCart = (id, size, color) => {
    dispatch(removeFromCart({ id, size, color }));
  };
  
  const handleQuantityChange = (item, action) => {
    if (action === 'increase' && item.quantity < item.stock) {
      dispatch(addToCart({
        ...item,
        quantity: item.quantity + 1
      }));
    } else if (action === 'decrease' && item.quantity > 1) {
      dispatch(addToCart({
        ...item,
        quantity: item.quantity - 1
      }));
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Giỏ hàng của bạn
      </Typography>
      
      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            size="large"
            color="primary"
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="right">Giá</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Tổng</TableCell>
                    <TableCell align="center">Xóa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={`${item.product}-${item.size}-${item.color}`}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            variant="square"
                            sx={{ width: 60, height: 60, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle1">
                              <RouterLink to={`/products/${item.product}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {item.name}
                              </RouterLink>
                            </Typography>
                            {item.size && (
                              <Typography variant="body2" color="text.secondary">
                                Kích cỡ: {item.size}
                              </Typography>
                            )}
                            {item.color && (
                              <Typography variant="body2" color="text.secondary">
                                Màu sắc: {item.color}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {item.price.toLocaleString('vi-VN')}đ
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item, 'decrease')}
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            InputProps={{
                              readOnly: true,
                              disableUnderline: true,
                              inputProps: {
                                style: { textAlign: 'center', width: '30px' },
                              },
                            }}
                            variant="standard"
                          />
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item, 'increase')}
                            disabled={item.quantity >= item.stock}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveFromCart(item.product, item.size, item.color)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                component={RouterLink}
                to="/products"
                startIcon={<ShoppingCart />}
                variant="outlined"
              >
                Tiếp tục mua sắm
              </Button>
            </Box>
          </Grid>
          
          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tổng giỏ hàng
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Tạm tính:</Typography>
                    <Typography variant="body1">{itemsPrice.toLocaleString('vi-VN')}đ</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Phí vận chuyển:</Typography>
                    <Typography variant="body1">
                      {shippingPrice > 0 ? `${shippingPrice.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6" color="primary">
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                >
                  Tiến hành thanh toán
                </Button>
                
                {shippingPrice > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Mua thêm {(500000 - itemsPrice).toLocaleString('vi-VN')}đ để được miễn phí vận chuyển
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;
