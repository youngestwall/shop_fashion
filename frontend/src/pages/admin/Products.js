import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
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
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
} from '@mui/icons-material';
import products from '../../data/productData'; // Import dữ liệu sản phẩm mẫu

const Products = () => {
  // Sử dụng dữ liệu sản phẩm mẫu thay vì mock data cũ
  const [productsList, setProductsList] = useState(products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredProducts = productsList.filter(
    product => product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    // Simulate delete by filtering out the product
    setProductsList(productsList.filter(product => product._id !== productToDelete));
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  
  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý sản phẩm
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm sản phẩm..."
            variant="outlined"
            size="small"
            sx={{ width: '300px' }}
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            component={RouterLink}
            to="/admin/products/add"
            variant="contained"
            startIcon={<Add />}
          >
            Thêm sản phẩm mới
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell align="right">Tồn kho</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product._id}</TableCell>
                <TableCell>
                  <Avatar
                    src={product.images[0]}
                    alt={product.name}
                    variant="square"
                    sx={{ width: 60, height: 60 }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell align="right">{product.price.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell align="right">
                  {product.stock > 0 ? (
                    <Chip
                      label={`${product.stock} sản phẩm`}
                      color={product.stock > 10 ? 'success' : 'warning'}
                      size="small"
                    />
                  ) : (
                    <Chip label="Hết hàng" color="error" size="small" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    component={RouterLink}
                    to={`/products/${product._id}`}
                    color="primary"
                    size="small"
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    component={RouterLink}
                    to={`/admin/products/edit/${product._id}`}
                    color="primary"
                    size="small"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(product._id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={Math.ceil(filteredProducts.length / 10)} 
          color="primary" 
        />
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xóa sản phẩm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products;
