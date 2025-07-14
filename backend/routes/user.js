const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// Import controller methods (to be created)
const { 
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile
} = require('../controllers/userController');

// User routes
router.route('/profile')
  .put(protect, updateProfile);

// Admin routes
router.use(protect, authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
