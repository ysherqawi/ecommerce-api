const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const {
  createOrder,
  getOrders,
  getStatusValues,
  orderById,
  getOrder,
  updateOrderStatus,
} = require('../controllers/orders');

const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

const {
  addOrderToUserHistory,
  decreaseQuantity,
} = require('../middleware/orders');

router
  .route('/create')
  .post(protect, addOrderToUserHistory, decreaseQuantity, createOrder);

router
  .route('/admin/list')
  .get(protect, authorize('admin'), advancedResults(Order, 'user'), getOrders);

router
  .route('/admin/status-values')
  .get(protect, authorize('admin'), getStatusValues);

router
  .route('/admin/:id')
  .get(protect, authorize('admin'), getOrder)
  .put(protect, authorize('admin'), updateOrderStatus);

router.param('id', orderById);

module.exports = router;
