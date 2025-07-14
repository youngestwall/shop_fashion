import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Divider,
  Breadcrumbs,
  Link,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  FavoriteBorder,
  Share,
} from '@mui/icons-material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import Loader from '../../components/ui/Loader';
import products from '../../data/productData'; // Import dữ liệu sản phẩm mẫu

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Local state for product selection
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  useEffect(() => {
    // Simulate API call with the mock data
    setLoading(true);
    setTimeout(() => {
      const foundProduct = products.find(p => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedSize(foundProduct.sizes && foundProduct.sizes.length > 0 ? foundProduct.sizes[0] : '');
        setSelectedColor(foundProduct.colors && foundProduct.colors.length > 0 ? foundProduct.colors[0] : '');
      } else {
        setError('Không tìm thấy sản phẩm');
      }
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => Math.min(prev + 1, product.stock));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        quantity,
        stock: product.stock,
      }));
      setSnackbarOpen(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Settings for image slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  
  if (loading) return <Loader />;
  
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">
          Sản phẩm không tồn tại
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Trang chủ
        </Link>
        <Link component={RouterLink} to="/products" underline="hover" color="inherit">
          Sản phẩm
        </Link>
        {product.category && (
          <Link 
            component={RouterLink} 
            to={`/products?category=${product.category.slug}`} 
            underline="hover" 
            color="inherit"
          >
            {product.category.name}
          </Link>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1}>
            {product.images && product.images.length > 0 && (
              <Slider {...sliderSettings}>
                {product.images.map((image, index) => (
                  <Box key={index} sx={{ height: { xs: '300px', md: '500px' } }}>
                    <img 
                      src={image} 
                      alt={`${product.name} - ảnh ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                ))}
              </Slider>
            )}
          </Paper>
        </Grid>
        
        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.ratings || 0} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.numReviews || 0} đánh giá)
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              {product.price?.toLocaleString('vi-VN')}đ
            </Typography>
            {product.originalPrice > product.price && (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ textDecoration: 'line-through' }}
              >
                {product.originalPrice?.toLocaleString('vi-VN')}đ
              </Typography>
            )}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Product Details */}
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Kích cỡ</InputLabel>
                  <Select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    label="Kích cỡ"
                  >
                    {product.sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Màu sắc</InputLabel>
                  <Select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    label="Màu sắc"
                  >
                    {product.colors.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {/* Quantity Selection */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2 }}>Số lượng:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
                  <IconButton 
                    onClick={() => handleQuantityChange('decrease')} 
                    disabled={quantity <= 1}
                    size="small"
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0 && value <= product.stock) {
                        setQuantity(value);
                      }
                    }}
                    inputProps={{ min: 1, max: product.stock, style: { textAlign: 'center' } }}
                    sx={{ width: '60px' }}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                  <IconButton 
                    onClick={() => handleQuantityChange('increase')} 
                    disabled={quantity >= product.stock}
                    size="small"
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  {product.stock} sản phẩm có sẵn
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Add to Cart Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            fullWidth
            sx={{ mb: 2 }}
          >
            {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </Button>
          
          {/* Wishlist and Share */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button startIcon={<FavoriteBorder />} variant="outlined">
              Yêu thích
            </Button>
            <Button startIcon={<Share />} variant="outlined">
              Chia sẻ
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Snackbar notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Đã thêm sản phẩm vào giỏ hàng!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetailPage;
