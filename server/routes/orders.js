const express = require('express');
const router = express.Router();

const { createOrder } = require('../controllers/orders');

const { protect } = require('../middleware/auth');

const {
  addOrderToUserHistory,
  decreaseQuantity,
} = require('../middleware/orders');

router
  .route('/create')
  .post(protect, addOrderToUserHistory, decreaseQuantity, createOrder);

module.exports = router;
