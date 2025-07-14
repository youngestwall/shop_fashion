import React, { useState } from 'react';
import {
  Box,
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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Avatar,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Search,
  PersonAdd,
} from '@mui/icons-material';

const Users = () => {
  // Mock data for users
  const [users, setUsers] = useState([
    {
      _id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      role: 'admin',
      createdAt: '2023-07-15T10:30:00Z',
    },
    {
      _id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'user',
      createdAt: '2023-07-25T14:20:00Z',
    },
    {
      _id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'user',
      createdAt: '2023-08-01T09:15:00Z',
    },
    {
      _id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      role: 'user',
      createdAt: '2023-08-10T16:45:00Z',
    },
  ]);
  
  // State for dialogs, menus, and forms
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
  });
  
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  
  // Helper functions
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  // Menu handlers
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Dialog handlers
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    // In a real app, you would dispatch an action to delete the user
    setUsers(users.filter(user => user._id !== selectedUser._id));
    setDeleteDialogOpen(false);
  };
  
  const handleEditDialogOpen = () => {
    setEditForm({
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };
  
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };
  
  const handleEditSubmit = () => {
    // In a real app, you would dispatch an action to update the user
    setUsers(users.map(user => 
      user._id === selectedUser._id ? { ...user, ...editForm } : user
    ));
    setEditDialogOpen(false);
  };
  
  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };
  
  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setAddForm({
      name: '',
      email: '',
      password: '',
      role: 'user',
    });
  };
  
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm({
      ...addForm,
      [name]: value,
    });
  };
  
  const handleAddSubmit = () => {
    // In a real app, you would dispatch an action to create the user
    const newUser = {
      _id: (users.length + 1).toString(),
      ...addForm,
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    handleAddDialogClose();
  };
  
  // Filter users based on search and role filter
  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => roleFilter ? user.role === roleFilter : true);

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý người dùng
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Lọc theo vai trò</InputLabel>
              <Select
                value={roleFilter}
                label="Lọc theo vai trò"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="user">Người dùng</MenuItem>
                <MenuItem value="admin">Quản trị viên</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleAddDialogOpen}
            >
              Thêm người dùng mới
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>{user.name.charAt(0)}</Avatar>
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, user)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* User Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditDialogOpen}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleDeleteDialogOpen}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Xóa người dùng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa người dùng {selectedUser?.name} không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
      >
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            name="name"
            label="Họ tên"
            value={editForm.name}
            onChange={handleEditFormChange}
          />
          <TextField
            fullWidth
            margin="dense"
            name="email"
            label="Email"
            type="email"
            value={editForm.email}
            onChange={handleEditFormChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={editForm.role}
              label="Vai trò"
              onChange={handleEditFormChange}
            >
              <MenuItem value="user">Người dùng</MenuItem>
              <MenuItem value="admin">Quản trị viên</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Hủy</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add User Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
      >
        <DialogTitle>Thêm người dùng mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            name="name"
            label="Họ tên"
            value={addForm.name}
            onChange={handleAddFormChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            name="email"
            label="Email"
            type="email"
            value={addForm.email}
            onChange={handleAddFormChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            name="password"
            label="Mật khẩu"
            type="password"
            value={addForm.password}
            onChange={handleAddFormChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={addForm.role}
              label="Vai trò"
              onChange={handleAddFormChange}
            >
              <MenuItem value="user">Người dùng</MenuItem>
              <MenuItem value="admin">Quản trị viên</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Hủy</Button>
          <Button 
            onClick={handleAddSubmit} 
            variant="contained"
            disabled={!addForm.name || !addForm.email || !addForm.password}
          >
            Thêm mới
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;
