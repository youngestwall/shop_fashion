import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { getOrderDetails } from '../../features/orders/orderSlice';
import Loader from '../../components/ui/Loader';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Helper function to get status step
  const getStatusStep = (status) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  // Helper function to translate status
  const translateStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Loader />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Không tìm thấy đơn hàng</Alert>
      </Container>
    );
  }

  const steps = ['Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Giao hàng thành công'];
  const activeStep = getStatusStep(order.status);

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Chi tiết đơn hàng
        </Typography>
        <Button component={RouterLink} to="/orders" variant="outlined">
          Quay lại
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Mã đơn hàng: #{order._id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đặt hàng ngày: {formatDate(order.createdAt)}
              </Typography>
            </Box>

            {order.status === 'cancelled' ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Đơn hàng đã bị hủy
              </Alert>
            ) : (
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Thông tin giao hàng
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body1">{order.shippingAddress.fullName}</Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </Typography>
                  <Typography variant="body2">Điện thoại: {order.shippingAddress.phone}</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Thông tin thanh toán
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2">
                    Phương thức: {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {order.isPaid ? (
                      <Chip label="Đã thanh toán" color="success" size="small" />
                    ) : (
                      <Chip label="Chưa thanh toán" size="small" />
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm đã đặt
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="right">Giá</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Tổng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={`${item.product}-${item.size}-${item.color}`}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            variant="square"
                            sx={{ width: 50, height: 50, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="body1">{item.name}</Typography>
                            {item.size && (
                              <Typography variant="body2" color="text.secondary">
                                Kích cỡ: {item.size}
                              </Typography>
                            )}
                            {item.color && (
                              <Typography variant="body2" color="text.secondary">
                                Màu: {item.color}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{item.price.toLocaleString('vi-VN')}đ</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tổng đơn hàng
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Tạm tính" />
                <Typography variant="body1">
                  {(order.totalPrice - order.shippingPrice).toLocaleString('vi-VN')}đ
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Phí vận chuyển" />
                <Typography variant="body1">
                  {order.shippingPrice > 0
                    ? `${order.shippingPrice.toLocaleString('vi-VN')}đ`
                    : 'Miễn phí'}
                </Typography>
              </ListItem>

              <Divider />
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Tổng cộng" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {order.totalPrice.toLocaleString('vi-VN')}đ
                </Typography>
              </ListItem>
            </List>

            {order.status === 'pending' && (
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
              >
                Hủy đơn hàng
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage;
