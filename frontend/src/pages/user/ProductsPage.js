import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import Loader from '../../components/ui/Loader';
import SearchBar from '../../components/ui/SearchBar';
import products from '../../data/productData'; // Import dữ liệu sản phẩm mẫu

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState(products);
  const [categories, setCategories] = useState([
    { _id: '1', name: 'Thời trang nam', slug: 'thoi-trang-nam' },
    { _id: '2', name: 'Thời trang nữ', slug: 'thoi-trang-nu' },
    { _id: '3', name: 'Giày dép', slug: 'giay-dep' },
    { _id: '4', name: 'Mỹ phẩm', slug: 'my-pham' },
  ]);
  
  const keyword = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const pageNumber = parseInt(searchParams.get('page') || '1');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  
  // Lọc sản phẩm theo tham số
  const filteredProducts = productsList.filter(product => {
    // Lọc theo từ khóa
    const matchesKeyword = keyword ? 
      product.name.toLowerCase().includes(keyword.toLowerCase()) || 
      product.description.toLowerCase().includes(keyword.toLowerCase()) : 
      true;
    
    // Lọc theo danh mục
    const matchesCategory = categoryParam ? 
      product.category.slug === categoryParam : 
      true;
    
    return matchesKeyword && matchesCategory;
  });
  
  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case 'price':
        return a.price - b.price;
      case '-price':
        return b.price - a.price;
      case '-createdAt':
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      case '-ratings':
        return b.ratings - a.ratings;
      default:
        return 0;
    }
  });
  
  // Phân trang
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const currentPageProducts = sortedProducts.slice(
    (pageNumber - 1) * ITEMS_PER_PAGE,
    pageNumber * ITEMS_PER_PAGE
  );
  
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);
    
    // Update URL with new sort parameter
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    setSearchParams(params);
  };
  
  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', value);
    setSearchParams(params);
  };
  
  // Find current category name if category param exists
  const currentCategory = categories?.find(cat => cat.slug === categoryParam);

  return (
    <Container sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Trang chủ
        </Link>
        {currentCategory ? (
          <Typography color="text.primary">{currentCategory.name}</Typography>
        ) : (
          <Typography color="text.primary">Tất cả sản phẩm</Typography>
        )}
      </Breadcrumbs>
      
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {currentCategory ? currentCategory.name : "Tất cả sản phẩm"}
        {keyword && ` - Kết quả tìm kiếm: "${keyword}"`}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Left sidebar - filters */}
        <Grid item xs={12} md={3}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Tìm kiếm
            </Typography>
            <SearchBar />
          </Paper>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Danh mục
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!categoryParam} 
                    onChange={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete('category');
                      setSearchParams(params);
                    }} 
                  />
                }
                label="Tất cả sản phẩm"
              />
              {categories?.map((category) => (
                <FormControlLabel
                  key={category._id}
                  control={
                    <Checkbox 
                      checked={category.slug === categoryParam} 
                      onChange={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('category', category.slug);
                        params.set('page', '1'); // Reset to page 1 when changing category
                        setSearchParams(params);
                      }}
                    />
                  }
                  label={category.name}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>
        
        {/* Right side - products */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography>
              Hiển thị {currentPageProducts.length} / {filteredProducts.length} sản phẩm
            </Typography>
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                value={sort}
                onChange={handleSortChange}
                label="Sắp xếp theo"
              >
                <MenuItem value="">Mặc định</MenuItem>
                <MenuItem value="price">Giá: Thấp đến cao</MenuItem>
                <MenuItem value="-price">Giá: Cao đến thấp</MenuItem>
                <MenuItem value="-createdAt">Mới nhất</MenuItem>
                <MenuItem value="-ratings">Đánh giá cao nhất</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {loading ? (
            <Loader />
          ) : currentPageProducts?.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Không tìm thấy sản phẩm nào
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Vui lòng thử từ khóa khác hoặc danh mục khác
              </Typography>
              <Button 
                component={RouterLink}
                to="/products"
                variant="contained"
              >
                Xem tất cả sản phẩm
              </Button>
            </Paper>
          ) : (
            <>
              <Grid container spacing={2}>
                {currentPageProducts?.map((product) => (
                  <Grid item xs={12} sm={6} md={6} lg={3} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={pageNumber} 
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductsPage;
