import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Instagram, Twitter, Pinterest, YouTube } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mt: 'auto' }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom component="h2">
              FASHION SHOP
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Chúng tôi chuyên cung cấp các sản phẩm thời trang chất lượng cao, 
              giá cả hợp lý cùng dịch vụ chăm sóc khách hàng tận tâm.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Pinterest">
                <Pinterest />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom component="h2">
              DANH MỤC SẢN PHẨM
            </Typography>
            <Link component={RouterLink} to="/products?category=women" color="inherit" display="block" sx={{ mb: 1 }}>
              Thời trang nữ
            </Link>
            <Link component={RouterLink} to="/products?category=men" color="inherit" display="block" sx={{ mb: 1 }}>
              Thời trang nam
            </Link>
            <Link component={RouterLink} to="/products?category=shoes" color="inherit" display="block" sx={{ mb: 1 }}>
              Giày dép
            </Link>
            <Link component={RouterLink} to="/products?category=cosmetics" color="inherit" display="block" sx={{ mb: 1 }}>
              Mỹ phẩm
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom component="h2">
              THÔNG TIN
            </Typography>
            <Link component={RouterLink} to="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              Giới thiệu
            </Link>
            <Link component={RouterLink} to="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              Liên hệ
            </Link>
            <Link component={RouterLink} to="/terms" color="inherit" display="block" sx={{ mb: 1 }}>
              Điều khoản dịch vụ
            </Link>
            <Link component={RouterLink} to="/privacy" color="inherit" display="block" sx={{ mb: 1 }}>
              Chính sách bảo mật
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom component="h2">
              LIÊN HỆ
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@fashionshop.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Điện thoại: (028) 1234 5678
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Hotline: 1900 1234
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Fashion Shop. Tất cả các quyền được bảo lưu.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
