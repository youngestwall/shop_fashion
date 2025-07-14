import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 5
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Trang không tìm thấy
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '600px' }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" component={Link} to="/" color="primary" sx={{ mr: 2 }}>
            Quay về trang chủ
          </Button>
          <Button variant="outlined" component={Link} to="/products" color="primary">
            Xem sản phẩm
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
