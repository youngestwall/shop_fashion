import React, { useState } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CloudUpload,
} from '@mui/icons-material';

const Categories = () => {
  // Mock data for categories
  const [categories, setCategories] = useState([
    {
      _id: '1',
      name: 'Thời trang nam',
      slug: 'thoi-trang-nam',
      description: 'Các sản phẩm thời trang dành cho nam giới',
      image: 'https://via.placeholder.com/100',
      parent: null,
    },
    {
      _id: '2',
      name: 'Thời trang nữ',
      slug: 'thoi-trang-nu',
      description: 'Các sản phẩm thời trang dành cho nữ giới',
      image: 'https://via.placeholder.com/100',
      parent: null,
    },
    {
      _id: '3',
      name: 'Giày dép',
      slug: 'giay-dep',
      description: 'Các sản phẩm giày dép cho nam và nữ',
      image: 'https://via.placeholder.com/100',
      parent: null,
    },
    {
      _id: '4',
      name: 'Mỹ phẩm',
      slug: 'my-pham',
      description: 'Các sản phẩm mỹ phẩm, chăm sóc da',
      image: 'https://via.placeholder.com/100',
      parent: null,
    },
  ]);
  
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parent: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const handleClickOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentCategory({
      name: '',
      slug: '',
      description: '',
      image: '',
      parent: '',
    });
    setImagePreview('');
    setImageFile(null);
  };
  
  const handleEdit = (category) => {
    setOpen(true);
    setEditMode(true);
    setCurrentCategory(category);
    setImagePreview(category.image);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value,
    });
    
    // Auto-generate slug from name if in creation mode
    if (name === 'name' && !editMode) {
      setCurrentCategory(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      }));
    }
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    // In a real app, you would dispatch an action to create/update the category
    if (editMode) {
      // Update existing category
      setCategories(prev => 
        prev.map(cat => 
          cat._id === currentCategory._id ? { ...currentCategory, image: imagePreview || cat.image } : cat
        )
      );
    } else {
      // Add new category
      const newId = Math.max(...categories.map(c => parseInt(c._id))) + 1;
      setCategories(prev => [
        ...prev, 
        { 
          ...currentCategory, 
          _id: newId.toString(),
          image: imagePreview || 'https://via.placeholder.com/100' 
        }
      ]);
    }
    
    handleClose();
  };
  
  const handleDelete = (id) => {
    // In a real app, you would dispatch an action to delete the category
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      setCategories(prev => prev.filter(cat => cat._id !== id));
    }
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý danh mục
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleClickOpen}
          sx={{ mb: 2 }}
        >
          Thêm danh mục mới
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Danh mục cha</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category._id}</TableCell>
                <TableCell>
                  <Avatar
                    src={category.image}
                    alt={category.name}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {category.parent 
                    ? categories.find(c => c._id === category.parent)?.name 
                    : 'Không có'}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(category._id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Category Dialog Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="dense"
                name="name"
                label="Tên danh mục"
                value={currentCategory.name}
                onChange={handleChange}
                required
              />
              
              <TextField
                fullWidth
                margin="dense"
                name="slug"
                label="Slug"
                value={currentCategory.slug}
                onChange={handleChange}
                required
                helperText="Slug được sử dụng trong URL, chỉ chứa chữ thường, số và dấu gạch ngang"
              />
              
              <TextField
                fullWidth
                margin="dense"
                name="description"
                label="Mô tả"
                value={currentCategory.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
              
              <FormControl fullWidth margin="dense">
                <InputLabel>Danh mục cha (nếu có)</InputLabel>
                <Select
                  name="parent"
                  value={currentCategory.parent || ''}
                  onChange={handleChange}
                  label="Danh mục cha (nếu có)"
                >
                  <MenuItem value="">
                    <em>Không có</em>
                  </MenuItem>
                  {categories
                    .filter(cat => cat._id !== currentCategory._id)
                    .map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Hình ảnh danh mục
              </Typography>
              
              <Box
                sx={{ 
                  width: '100%',
                  height: 200,
                  border: '1px dashed #ccc',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {!imagePreview && <Typography color="text.secondary">Chưa có hình ảnh</Typography>}
              </Box>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Tải lên hình ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Categories;
