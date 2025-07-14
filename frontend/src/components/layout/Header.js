import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Search,
  Menu as MenuIcon,
  Close,
} from '@mui/icons-material';
import SearchBar from '../ui/SearchBar';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const menuItems = [
    { text: 'Trang chủ', path: '/' },
    { text: 'Thời trang nữ', path: '/products?category=women' },
    { text: 'Thời trang nam', path: '/products?category=men' },
    { text: 'Giày dép', path: '/products?category=shoes' },
    { text: 'Mỹ phẩm', path: '/products?category=cosmetics' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {!user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/login"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Đăng nhập" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/register"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Đăng ký" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/profile"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Tài khoản" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/orders"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Đơn hàng" />
              </ListItemButton>
            </ListItem>
            {user.role === 'admin' && (
              <ListItem disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to="/admin"
                  onClick={handleDrawerToggle}
                >
                  <ListItemText primary="Quản trị" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                handleDrawerToggle();
                dispatch(logout());
              }}>
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 1,
              fontFamily: 'Playfair Display',
            }}
          >
            FASHION SHOP
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', mx: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{ color: 'text.primary', mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={toggleSearch}>
              <Search />
            </IconButton>

            <IconButton
              component={RouterLink}
              to="/cart"
              color="inherit"
              aria-label="cart"
            >
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {!user ? (
              !isMobile && (
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  Đăng nhập
                </Button>
              )
            ) : (
              <>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem 
                    component={RouterLink} 
                    to="/profile" 
                    onClick={handleClose}
                  >
                    Tài khoản
                  </MenuItem>
                  <MenuItem 
                    component={RouterLink} 
                    to="/orders" 
                    onClick={handleClose}
                  >
                    Đơn hàng
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem
                      component={RouterLink}
                      to="/admin"
                      onClick={handleClose}
                    >
                      Quản trị
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      {searchVisible && (
        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <SearchBar onClose={toggleSearch} />
        </Box>
      )}
    </>
  );
};

export default Header;
