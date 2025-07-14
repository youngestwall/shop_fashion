const express = require('express');
const router = express.Router();
// Fix middleware path
const { protect, authorize } = require('../middlewares/auth');
const { 
  register, 
  login, 
  getMe, 
  adminLogin,
  checkFirstAdmin,
  setupFirstAdmin,
  registerAdmin,
  adminDebugLogin
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/check-first-admin', checkFirstAdmin);
router.post('/setup-first-admin', setupFirstAdmin);
router.post('/admin-debug-login', adminDebugLogin);

// Protected routes
router.get('/me', protect, getMe);
router.post('/register-admin', protect, authorize('admin'), registerAdmin);

module.exports = router;
