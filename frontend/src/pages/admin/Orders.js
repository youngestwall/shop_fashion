import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Pagination,
} from '@mui/material';
import {
  Visibility,
  MoreVert,
  Search,
} from '@mui/icons-material';

const Orders = () => {
  // Mock data for orders
  const [orders, setOrders] = useState([
    {
      _id: 'ORD001',
      user: { id: 'USER1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' },
      totalPrice: 1250000,
      status: 'pending',
      isPaid: false,
      createdAt: '2023-08-15T08:30:00Z',
    },
    {
      _id: 'ORD002',
      user: { id: 'USER2', name: 'Trần Thị B', email: 'tranthib@example.com' },
      totalPrice: 850000,
      status: 'processing',
      isPaid: true,
      createdAt: '2023-08-14T15:45:00Z',
    },
    {
      _id: 'ORD003',
      user: { id: 'USER3', name: 'Lê Văn C', email: 'levanc@example.com' },
      totalPrice: 2100000,
      status: 'shipped',
      isPaid: true,
      createdAt: '2023-08-12T11:20:00Z',
    },
    {
      _id: 'ORD004',
      user: { id: 'USER4', name: 'Phạm Thị D', email: 'phamthid@example.com' },
      totalPrice: 3050000,
      status: 'delivered',
      isPaid: true,
      createdAt: '2023-08-10T09:15:00Z',
    },
    {
      _id: 'ORD005',
      user: { id: 'USER5', name: 'Hoàng Văn E', email: 'hoangvane@example.com' },
      totalPrice: 450000,
      status: 'cancelled',
      isPaid: false,
      createdAt: '2023-08-09T14:50:00Z',
    },
  ]);
  
  // State for menu and dialogs
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Helper functions
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
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
  
  // Menu handlers
  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Dialog handlers
  const handleDetailsOpen = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
    handleMenuClose();
  };
  
  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };
  
  const handleStatusDialogOpen = () => {
    setSelectedStatus(selectedOrder.status);
    setStatusDialogOpen(true);
    handleMenuClose();
  };
  
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };
  
  // Update order status
  const handleUpdateStatus = () => {
    setOrders(orders.map(order => 
      order._id === selectedOrder._id ? { ...order, status: selectedStatus } : order
    ));
    setStatusDialogOpen(false);
  };
  
  // Filter and search
  const filteredOrders = orders
    .filter(order => order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     order.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(order => filterStatus ? order.status === filterStatus : true);
  
  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý đơn hàng
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Lọc theo trạng thái</InputLabel>
              <Select
                value={filterStatus}
                label="Lọc theo trạng thái"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="processing">Đang xử lý</MenuItem>
                <MenuItem value="shipped">Đang giao hàng</MenuItem>
                <MenuItem value="delivered">Đã giao hàng</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Typography variant="body2">{order.user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.user.email}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {order.totalPrice.toLocaleString('vi-VN')}đ
                </TableCell>
                <TableCell>
                  <Chip
                    label={translateStatus(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {order.isPaid ? (
                    <Chip label="Đã thanh toán" color="success" size="small" />
                  ) : (
                    <Chip label="Chưa thanh toán" size="small" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleDetailsOpen(order)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, order)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={1} color="primary" />
      </Box>
      
      {/* Order Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleDetailsOpen(selectedOrder)}>
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleStatusDialogOpen}>
          Cập nhật trạng thái
        </MenuItem>
      </Menu>
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog
          open={detailsOpen}
          onClose={handleDetailsClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Chi tiết đơn hàng #{selectedOrder._id}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Thông tin đơn hàng
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Mã đơn hàng:</strong> {selectedOrder._id}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Ngày đặt:</strong> {formatDate(selectedOrder.createdAt)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Trạng thái:</strong>{' '}
                    <Chip
                      label={translateStatus(selectedOrder.status)}
                      color={getStatusColor(selectedOrder.status)}
                      size="small"
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Thanh toán:</strong>{' '}
                    {selectedOrder.isPaid ? (
                      <Chip label="Đã thanh toán" color="success" size="small" />
                    ) : (
                      <Chip label="Chưa thanh toán" size="small" />
                    )}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Thông tin khách hàng
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Họ tên:</strong> {selectedOrder.user.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Email:</strong> {selectedOrder.user.email}
                  </Typography>
                  {/* Additional customer details would go here */}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Chi tiết đơn hàng
                </Typography>
                <Paper variant="outlined">
                  {/* Sample order items - in a real app, these would come from the API */}
                  <List>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <ListItemText
                            primary="Áo phông nam"
                            secondary="Size: L, Màu: Trắng, Số lượng: 2"
                          />
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          <Typography>250,000đ x 2 = 500,000đ</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <ListItemText
                            primary="Quần jeans nữ"
                            secondary="Size: M, Màu: Xanh, Số lượng: 1"
                          />
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          <Typography>450,000đ</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Tổng cộng</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          <Typography fontWeight="bold">
                            {selectedOrder.totalPrice.toLocaleString('vi-VN')}đ
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailsClose}>Đóng</Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleStatusDialogOpen}
            >
              Cập nhật trạng thái
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose}>
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="pending">Chờ xác nhận</MenuItem>
              <MenuItem value="processing">Đang xử lý</MenuItem>
              <MenuItem value="shipped">Đang giao hàng</MenuItem>
              <MenuItem value="delivered">Đã giao hàng</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Hủy</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
