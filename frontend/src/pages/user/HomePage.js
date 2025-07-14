import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Grid, Container, Card, CardMedia, CardContent, CardActions, Divider } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { fetchFeaturedProducts } from '../../features/products/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import ProductCard from '../../components/products/ProductCard';
import Loader from '../../components/ui/Loader';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading: productLoading } = useSelector((state) => state.products);
  const { categories, loading: categoryLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Hero section settings for the slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Slider {...settings}>
          <Box>
            <Box
              sx={{
                height: { xs: '50vh', sm: '70vh' },
                background: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80") center/cover no-repeat',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <Box sx={{ maxWidth: 600, color: 'white', bgcolor: 'rgba(0,0,0,0.6)', p: 4, borderRadius: 1 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  Bộ sưu tập mùa Hè 2023
                </Typography>
                <Typography variant="body1" paragraph>
                  Khám phá các xu hướng thời trang mới nhất với bộ sưu tập mùa hè độc đáo
                </Typography>
                <Button
                  component={RouterLink}
                  to="/products?category=women"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': {
                      bgcolor: 'black',
                      color: 'white',
                    },
                  }}
                >
                  Mua sắm ngay
                </Button>
              </Box>
            </Box>
          </Box>
          
          {/* Additional hero slides */}
          <Box>
            <Box
              sx={{
                height: { xs: '50vh', sm: '70vh' },
                background: 'url("https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80") center/cover no-repeat',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <Box sx={{ maxWidth: 600, color: 'white', bgcolor: 'rgba(0,0,0,0.6)', p: 4, borderRadius: 1 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  Thời trang Nam giới
                </Typography>
                <Typography variant="body1" paragraph>
                  Nâng tầm phong cách của bạn với những thiết kế hiện đại, đẳng cấp
                </Typography>
                <Button
                  component={RouterLink}
                  to="/products?category=men"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': {
                      bgcolor: 'black',
                      color: 'white',
                    },
                  }}
                >
                  Khám phá ngay
                </Button>
              </Box>
            </Box>
          </Box>
        </Slider>
      </Box>
      
      {/* Categories Section */}
      {!categoryLoading && categories?.length > 0 && (
        <Container>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Danh mục sản phẩm
          </Typography>
          
          <Grid container spacing={4}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category._id}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={category.image || "https://via.placeholder.com/300"}
                    alt={category.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h3">
                      {category.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      component={RouterLink} 
                      to={`/products?category=${category.slug}`} 
                      size="small"
                      fullWidth 
                    >
                      Xem sản phẩm
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
      
      <Divider sx={{ my: 6 }} />
      
      {/* Featured Products Section */}
      <Container>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Sản phẩm nổi bật
        </Typography>
        
        {productLoading ? (
          <Loader />
        ) : (
          <Grid container spacing={3}>
            {featuredProducts?.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            component={RouterLink} 
            to="/products" 
            variant="outlined" 
            size="large"
          >
            Xem tất cả sản phẩm
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
