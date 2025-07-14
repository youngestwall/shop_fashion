import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Box,
} from '@mui/material';

const ProductCard = ({ product }) => {
  return (
    <Card 
      className="product-card"
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 3,
        }
      }}
    >
      <CardActionArea component={RouterLink} to={`/products/${product._id}`}>
        <CardMedia
          component="img"
          height="250"
          image={product.images[0]}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h3" noWrap>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.ratings} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.numReviews})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
            {product.category?.name || 'Thời trang'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              {product.price.toLocaleString('vi-VN')}đ
            </Typography>
            {product.originalPrice > product.price && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ textDecoration: 'line-through', ml: 1 }}
              >
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button 
          component={RouterLink}
          to={`/products/${product._id}`}
          size="small" 
          color="primary" 
          fullWidth
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
