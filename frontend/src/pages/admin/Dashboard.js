import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Paper, Typography, Divider, Card, CardContent } from '@mui/material';
import { PeopleOutlined, ShoppingBagOutlined, AttachMoneyOutlined, ShoppingCartOutlined } from '@mui/icons-material';
// Comment out ApexCharts import until you install the package
// import Chart from 'react-apexcharts';
import { fetchDashboardStats } from '../../features/admin/adminSlice';
import Loader from '../../components/ui/Loader';
import products from '../../data/productData'; // Import dữ liệu sản phẩm mẫu

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {value}
            </Typography>
          </Grid>
          <Grid item xs sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                backgroundColor: color,
                borderRadius: 1,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 56,
                width: 56,
              }}
            >
              {icon}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Chart placeholder component until ApexCharts is installed
const ChartPlaceholder = ({ title, height = 350 }) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box 
        sx={{
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: 1,
          bgcolor: '#f9f9f9'
        }}
      >
        <Typography variant="body1" color="textSecondary">
          Chart will be displayed here
          <br />
          (Install react-apexcharts package to enable charts)
        </Typography>
      </Box>
    </Paper>
  );
};

// Recent Orders component
const RecentOrders = ({ orders = [] }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" gutterBottom>
      Đơn hàng gần đây
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {orders.length > 0 ? (
      <Box>
        {orders.map((order, index) => (
          <Box key={order._id} sx={{ mb: 2, pb: 2, borderBottom: index < orders.length - 1 ? '1px solid #eee' : 'none' }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  Mã đơn:
                </Typography>
                <Typography variant="body1">
                  #{order._id.substr(-6)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  Khách hàng:
                </Typography>
                <Typography variant="body1">
                  {order.user.name}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  Tổng tiền:
                </Typography>
                <Typography variant="body1">
                  {order.totalPrice.toLocaleString('vi-VN')}đ
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    ) : (
      <Typography variant="body1" align="center" sx={{ py: 3 }}>
        Không có đơn hàng nào gần đây
      </Typography>
    )}
  </Paper>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  // Mock data for dashboard stats if not available from API
  const dashboardData = stats || {
    totalOrders: 156,
    totalRevenue: 15600000,
    totalProducts: 45,
    totalUsers: 120,
    recentOrders: [
      { _id: 'ORD001', user: { name: 'Nguyễn Văn A' }, totalPrice: 1250000 },
      { _id: 'ORD002', user: { name: 'Trần Thị B' }, totalPrice: 850000 },
      { _id: 'ORD003', user: { name: 'Lê Văn C' }, totalPrice: 2100000 },
    ],
    productsByCategory: [
      { name: 'Thời trang nữ', count: 20 },
      { name: 'Thời trang nam', count: 15 },
      { name: 'Giày dép', count: 10 },
      { name: 'Mỹ phẩm', count: 5 }
    ]
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bảng điều khiển
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Tổng quan hoạt động của cửa hàng
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TỔNG ĐƠN HÀNG"
            value={dashboardData.totalOrders || 0}
            icon={<ShoppingCartOutlined sx={{ color: '#fff' }} />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TỔNG DOANH THU"
            value={`${(dashboardData.totalRevenue || 0).toLocaleString('vi-VN')}đ`}
            icon={<AttachMoneyOutlined sx={{ color: '#fff' }} />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TỔNG SẢN PHẨM"
            value={dashboardData.totalProducts || 0}
            icon={<ShoppingBagOutlined sx={{ color: '#fff' }} />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TỔNG KHÁCH HÀNG"
            value={dashboardData.totalUsers || 0}
            icon={<PeopleOutlined sx={{ color: '#fff' }} />}
            color="#F44336"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <ChartPlaceholder title="Xu hướng doanh thu" />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartPlaceholder title="Sản phẩm theo danh mục" />
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <RecentOrders orders={dashboardData.recentOrders} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
