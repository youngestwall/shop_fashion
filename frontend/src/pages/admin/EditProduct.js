import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Chip,
  IconButton,
  FormHelperText,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Add, Delete, CloudUpload, Save } from '@mui/icons-material';

const EditProduct = () => {
  const { id } = useParams();
  
  // Mock data for initial state
  const [productData, setProductData] = useState({
    name: 'Áo phông nam',
    description: 'Áo phông nam chất liệu cotton cao cấp, thoáng mát.',
    price: '250000',
    originalPrice: '300000',
    category: '1',
    stock: '50',
    isFeatured: true,
  });
  
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']);
  const [newSize, setNewSize] = useState('');
  
  const [colors, setColors] = useState(['Trắng', 'Đen', 'Xanh']);
  const [newColor, setNewColor] = useState('');
  
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
  ]);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Mock categories
  const categories = [
    { _id: '1', name: 'Thời trang nam' },
    { _id: '2', name: 'Thời trang nữ' },
    { _id: '3', name: 'Giày dép' },
    { _id: '4', name: 'Mỹ phẩm' },
  ];
  
  // Simulate fetching product data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Product data would be set here from API response
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };
  
  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter(size => size !== sizeToRemove));
  };
  
  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };
  
  const handleRemoveColor = (colorToRemove) => {
    setColors(colors.filter(color => color !== colorToRemove));
  };
  
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages([...images, ...selectedFiles]);
    
    // Generate preview URLs for the images
    const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...newImageUrls]);
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newImageUrls = [...imageUrls];
    if (index < imageUrls.length) {
      if (index >= imageUrls.length - images.length) {
        URL.revokeObjectURL(newImageUrls[index]); // Free up memory for new uploads
      }
      newImageUrls.splice(index, 1);
      setImageUrls(newImageUrls);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!productData.name) newErrors.name = 'Tên sản phẩm là bắt buộc';
    if (!productData.description) newErrors.description = 'Mô tả sản phẩm là bắt buộc';
    if (!productData.price) {
      newErrors.price = 'Giá sản phẩm là bắt buộc';
    } else if (isNaN(productData.price) || Number(productData.price) <= 0) {
      newErrors.price = 'Giá sản phẩm phải là số dương';
    }
    if (!productData.category) newErrors.category = 'Danh mục sản phẩm là bắt buộc';
    if (!productData.stock) {
      newErrors.stock = 'Số lượng tồn kho là bắt buộc';
    } else if (isNaN(productData.stock) || Number(productData.stock) < 0) {
      newErrors.stock = 'Số lượng tồn kho phải là số không âm';
    }
    if (imageUrls.length === 0) newErrors.images = 'Sản phẩm cần có ít nhất 1 hình ảnh';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Updated product data:', {
          ...productData,
          id,
          sizes,
          colors,
          images: imageUrls,
        });
        
        setLoading(false);
        setSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang tải...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          component={RouterLink}
          to="/admin/products"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa sản phẩm
        </Typography>
      </Box>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Sản phẩm đã được cập nhật thành công!
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Tên sản phẩm"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Mô tả sản phẩm"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Giá bán"
                name="price"
                type="number"
                value={productData.price}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                }}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá gốc (nếu có giảm giá)"
                name="originalPrice"
                type="number"
                value={productData.originalPrice}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Danh mục sản phẩm</InputLabel>
                <Select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  label="Danh mục sản phẩm"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Số lượng tồn kho"
                name="stock"
                type="number"
                value={productData.stock}
                onChange={handleInputChange}
                error={!!errors.stock}
                helperText={errors.stock}
              />
            </Grid>
            
            {/* Sizes Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Kích cỡ sản phẩm
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <TextField
                  label="Thêm kích cỡ"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSize}
                  startIcon={<Add />}
                >
                  Thêm
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {sizes.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    onDelete={() => handleRemoveSize(size)}
                  />
                ))}
              </Box>
            </Grid>
            
            {/* Colors Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Màu sắc sản phẩm
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <TextField
                  label="Thêm màu sắc"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddColor}
                  startIcon={<Add />}
                >
                  Thêm
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {colors.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    onDelete={() => handleRemoveColor(color)}
                  />
                ))}
              </Box>
            </Grid>
            
            {/* Images Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Hình ảnh sản phẩm
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ mb: 2 }}
              >
                Tải lên hình ảnh
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleImageChange}
                />
              </Button>
              
              {errors.images && (
                <FormHelperText error>{errors.images}</FormHelperText>
              )}
              
              <Grid container spacing={2}>
                {imageUrls.map((url, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        height: 150,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Save />}
              >
                Lưu thay đổi
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProduct;
