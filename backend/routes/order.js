const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// Import controller methods (to be created)
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  updateOrderStatus
} = require('../controllers/orderController');

// Protect all order routes
router.use(protect);

// User routes
router.route('/myorders')
  .get(getMyOrders);

router.route('/')
  .post(createOrder);

router.route('/:id')
  .get(getOrder);

// Admin routes
router.use(authorize('admin'));

router.route('/')
  .get(getOrders);

router.route('/:id')
  .put(updateOrder)
  .delete(deleteOrder);

router.route('/:id/status')
  .put(updateOrderStatus);

module.exports = router;
